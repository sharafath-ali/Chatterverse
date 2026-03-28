import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
  ],
};

// Call states: idle | calling | ringing | in-call
export const useVideoCallStore = create((set, get) => ({
  callState: "idle",
  callType: "video", // "video" | "audio"
  remoteUser: null, // { _id, fullName, profilePic }
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isAudioMuted: false,
  isVideoOff: false,

  // ── Initiate a call ──────────────────────────────────────────
  initiateCall: async (targetUser, callType = "video") => {
    const { user } = useAuthStore.getState();
    const socket = useAuthStore.getState().socket;
    if (!socket || !user) return;

    try {
      const constraints = {
        audio: true,
        video: callType === "video",
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      set({
        callState: "calling",
        callType,
        remoteUser: targetUser,
        localStream,
      });

      socket.emit("call:initiate", {
        to: targetUser._id,
        from: user._id,
        callerName: user.fullName,
        callerProfilePic: user.profilePic,
        callType,
      });
    } catch (err) {
      console.error("Failed to get media devices:", err);
      get().endCall();
    }
  },

  // ── Accept an incoming call ──────────────────────────────────
  acceptCall: async () => {
    const { remoteUser, callType } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket || !remoteUser) return;

    try {
      const constraints = {
        audio: true,
        video: callType === "video",
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      set({ localStream, callState: "in-call" });

      socket.emit("call:accept", { to: remoteUser._id });

      // Wait for the caller to send the offer
    } catch (err) {
      console.error("Failed to get media devices:", err);
      get().rejectCall();
    }
  },

  // ── Reject / Cancel call ─────────────────────────────────────
  rejectCall: () => {
    const { remoteUser } = get();
    const socket = useAuthStore.getState().socket;

    if (socket && remoteUser) {
      socket.emit("call:reject", { to: remoteUser._id });
    }
    get().cleanup();
  },

  // ── Create and send WebRTC offer ─────────────────────────────
  createOffer: async () => {
    const { remoteUser, localStream } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket || !remoteUser || !localStream) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    set({ peerConnection: pc });

    // Add local tracks to connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote tracks
    const remoteStream = new MediaStream();
    set({ remoteStream });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      // Force re-render by setting remoteStream again
      set({ remoteStream });
    };

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice-candidate", {
          to: remoteUser._id,
          candidate: event.candidate,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        get().endCall();
      }
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call:offer", {
      to: remoteUser._id,
      offer: pc.localDescription,
    });
  },

  // ── Handle received offer and send answer ────────────────────
  handleOffer: async (offer) => {
    const { remoteUser, localStream } = get();
    const socket = useAuthStore.getState().socket;
    if (!socket || !remoteUser || !localStream) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    set({ peerConnection: pc });

    // Add local tracks
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote tracks
    const remoteStream = new MediaStream();
    set({ remoteStream });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      set({ remoteStream });
    };

    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice-candidate", {
          to: remoteUser._id,
          candidate: event.candidate,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
        get().endCall();
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("call:answer", {
      to: remoteUser._id,
      answer: pc.localDescription,
    });
  },

  // ── Handle received answer ───────────────────────────────────
  handleAnswer: async (answer) => {
    const { peerConnection } = get();
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  },

  // ── Handle received ICE candidate ────────────────────────────
  handleIceCandidate: async (candidate) => {
    const { peerConnection } = get();
    if (!peerConnection) return;
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  },

  // ── Toggle audio ─────────────────────────────────────────────
  toggleAudio: () => {
    const { localStream, isAudioMuted } = get();
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = isAudioMuted; // toggle
    });
    set({ isAudioMuted: !isAudioMuted });
  },

  // ── Toggle video ─────────────────────────────────────────────
  toggleVideo: () => {
    const { localStream, isVideoOff } = get();
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff; // toggle
    });
    set({ isVideoOff: !isVideoOff });
  },

  // ── End call ─────────────────────────────────────────────────
  endCall: () => {
    const { remoteUser } = get();
    const socket = useAuthStore.getState().socket;

    if (socket && remoteUser) {
      socket.emit("call:end", { to: remoteUser._id });
    }
    get().cleanup();
  },

  // ── Cleanup everything ───────────────────────────────────────
  cleanup: () => {
    const { localStream, peerConnection } = get();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }

    set({
      callState: "idle",
      callType: "video",
      remoteUser: null,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isAudioMuted: false,
      isVideoOff: false,
    });
  },

  // ── Setup socket listeners (call once on app mount) ──────────
  setupCallListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Incoming call
    socket.on("call:incoming", ({ from, callerName, callerProfilePic, callType }) => {
      // Only accept if idle
      if (get().callState !== "idle") {
        socket.emit("call:reject", { to: from });
        return;
      }
      set({
        callState: "ringing",
        callType,
        remoteUser: {
          _id: from,
          fullName: callerName,
          profilePic: callerProfilePic,
        },
      });
    });

    // Call accepted by receiver
    socket.on("call:accepted", () => {
      set({ callState: "in-call" });
      // Caller creates the offer now
      get().createOffer();
    });

    // Call rejected
    socket.on("call:rejected", () => {
      get().cleanup();
    });

    // Receiver is unavailable (offline)
    socket.on("call:unavailable", () => {
      get().cleanup();
    });

    // Receive SDP offer (receiver side)
    socket.on("call:offer", ({ offer }) => {
      get().handleOffer(offer);
    });

    // Receive SDP answer (caller side)
    socket.on("call:answer", ({ answer }) => {
      get().handleAnswer(answer);
    });

    // Receive ICE candidate
    socket.on("call:ice-candidate", ({ candidate }) => {
      get().handleIceCandidate(candidate);
    });

    // Call ended by other party
    socket.on("call:ended", () => {
      get().cleanup();
    });
  },

  // ── Remove socket listeners ──────────────────────────────────
  removeCallListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("call:incoming");
    socket.off("call:accepted");
    socket.off("call:rejected");
    socket.off("call:unavailable");
    socket.off("call:offer");
    socket.off("call:answer");
    socket.off("call:ice-candidate");
    socket.off("call:ended");
  },
}));
