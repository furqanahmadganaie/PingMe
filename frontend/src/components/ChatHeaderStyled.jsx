import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeaderStyled = () => {
  const { selectedUser, setSelectedUser, isTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <header className="flex h-18 shrink-0 items-center justify-between border-b border-base-content/10 bg-base-100/85 px-3 backdrop-blur sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button className="btn btn-ghost btn-circle btn-sm md:hidden" onClick={() => setSelectedUser(null)} aria-label="Back to contacts">
          <ArrowLeft className="size-5" />
        </button>
        <div className="relative shrink-0">
          <img src={selectedUser?.profilePic || "/avatar.png"} alt="" className="size-11 rounded-2xl object-cover" />
          {isOnline && <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-base-100 bg-success" />}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-bold">{selectedUser?.fullName}</h3>
          <p className={`text-xs ${isTyping || isOnline ? "text-success" : "text-base-content/45"}`}>
            {isTyping ? "typing..." : isOnline ? "Online now" : "Offline"}
          </p>
        </div>
      </div>
      <button className="btn btn-ghost btn-circle btn-sm" aria-label="Conversation options">
        <MoreHorizontal className="size-5" />
      </button>
    </header>
  );
};

export default ChatHeaderStyled;
