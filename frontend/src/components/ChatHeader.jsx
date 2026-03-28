import { X, Video, Phone } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useVideoCallStore } from "../store/useVideoCallStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { initiateCall, callState } = useVideoCallStore();

  const isOnline = onlineUsers.includes(selectedUser._id);
  const canCall = isOnline && callState === "idle";

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {/* Audio Call */}
          <button
            onClick={() => canCall && initiateCall(selectedUser, "audio")}
            className={`btn btn-sm btn-ghost btn-circle ${
              canCall
                ? "text-base-content hover:text-success hover:bg-success/10"
                : "text-base-content/20 cursor-not-allowed"
            }`}
            disabled={!canCall}
            title={canCall ? "Audio call" : isOnline ? "Already in a call" : "User is offline"}
          >
            <Phone size={18} />
          </button>

          {/* Video Call */}
          <button
            onClick={() => canCall && initiateCall(selectedUser, "video")}
            className={`btn btn-sm btn-ghost btn-circle ${
              canCall
                ? "text-base-content hover:text-success hover:bg-success/10"
                : "text-base-content/20 cursor-not-allowed"
            }`}
            disabled={!canCall}
            title={canCall ? "Video call" : isOnline ? "Already in a call" : "User is offline"}
          >
            <Video size={18} />
          </button>

          {/* Close button */}
          <button onClick={() => setSelectedUser(null)} className="btn btn-sm btn-ghost btn-circle">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;