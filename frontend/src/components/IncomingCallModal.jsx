import { useVideoCallStore } from "../store/useVideoCallStore";
import { Phone, PhoneOff, Video } from "lucide-react";

const IncomingCallModal = () => {
  const { callState, callType, remoteUser, acceptCall, rejectCall } =
    useVideoCallStore();

  if (callState !== "ringing") return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          background: "linear-gradient(145deg, #1e1e2f 0%, #2a2a40 100%)",
        }}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="relative p-8 flex flex-col items-center gap-5">
          {/* Call type badge */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            {callType === "video" ? (
              <Video size={14} className="text-green-400" />
            ) : (
              <Phone size={14} className="text-green-400" />
            )}
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
              Incoming {callType} call
            </span>
          </div>

          {/* Caller avatar with ring animation */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-green-400/30 shadow-xl">
              <img
                src={remoteUser?.profilePic || "/avatar.png"}
                alt={remoteUser?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pulsing rings */}
            <div className="absolute inset-[-4px] rounded-full border-2 border-green-400/40 animate-ping" />
            <div className="absolute inset-[-12px] rounded-full border border-green-400/20 animate-pulse" />
          </div>

          {/* Caller name */}
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold">
              {remoteUser?.fullName}
            </h3>
            <p className="text-white/50 text-sm mt-1">is calling you...</p>
          </div>

          {/* Accept / Reject buttons */}
          <div className="flex items-center gap-8 mt-2">
            {/* Reject */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={rejectCall}
                className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95"
              >
                <PhoneOff size={24} />
              </button>
              <span className="text-white/50 text-xs font-medium">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={acceptCall}
                className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-all duration-300 shadow-lg shadow-green-500/40 hover:scale-105 active:scale-95 animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                <Phone size={24} />
              </button>
              <span className="text-white/50 text-xs font-medium">Accept</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
