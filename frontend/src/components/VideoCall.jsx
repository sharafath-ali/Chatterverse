import { useEffect, useRef } from "react";
import { useVideoCallStore } from "../store/useVideoCallStore";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
} from "lucide-react";

const VideoCall = () => {
  const {
    callState,
    callType,
    remoteUser,
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoOff,
    toggleAudio,
    toggleVideo,
    endCall,
  } = useVideoCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video element (for video calls)
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // ALWAYS attach remote stream to a hidden audio element for playback
  // This is critical for audio-only calls where no <video> element is rendered
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState !== "in-call" && callState !== "calling") return null;

  const isVideoCall = callType === "video";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    }}>
      {/* Hidden audio element — ensures remote audio always plays regardless of call type */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
      {/* Remote Video / Audio Avatar */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {isVideoCall && remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                <img
                  src={remoteUser?.profilePic || "/avatar.png"}
                  alt={remoteUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Pulsing ring animation for calling state */}
              {callState === "calling" && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-green-400/50 animate-ping" />
                  <div className="absolute inset-[-8px] rounded-full border-2 border-green-400/30 animate-pulse" />
                </>
              )}
            </div>
            <h2 className="text-white text-2xl font-semibold tracking-wide">
              {remoteUser?.fullName}
            </h2>
            <p className="text-white/60 text-sm font-medium tracking-wider uppercase">
              {callState === "calling" ? "Calling..." : callType === "audio" ? "Audio Call" : "Video Off"}
            </p>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        {isVideoCall && localStream && !isVideoOff && (
          <div className="absolute bottom-6 right-6 w-40 h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black/50 backdrop-blur-sm">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        )}

        {/* Call duration / status indicator */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${callState === "in-call" ? "bg-green-400 animate-pulse" : "bg-yellow-400 animate-pulse"}`} />
            <span className="text-white/80 text-sm font-medium">
              {callState === "calling" ? "Ringing..." : "Connected"}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="pb-10 pt-6 flex justify-center">
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl">
          {/* Mute Audio */}
          <button
            onClick={toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              isAudioMuted
                ? "bg-red-500/90 text-white shadow-lg shadow-red-500/30 hover:bg-red-600"
                : "bg-white/15 text-white hover:bg-white/25 border border-white/10"
            }`}
            title={isAudioMuted ? "Unmute" : "Mute"}
          >
            {isAudioMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Toggle Video (only for video calls) */}
          {isVideoCall && (
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                isVideoOff
                  ? "bg-red-500/90 text-white shadow-lg shadow-red-500/30 hover:bg-red-600"
                  : "bg-white/15 text-white hover:bg-white/25 border border-white/10"
              }`}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>
          )}

          {/* End Call */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-105 active:scale-95"
            title="End call"
          >
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
