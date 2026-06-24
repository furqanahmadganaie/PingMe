import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { formatMessageTime } from "../lib/utils";
import ChatHeaderStyled from "./ChatHeaderStyled";
import MessageInputStyled from "./MessageInputStyled";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainerStyled = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    isTyping,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return undefined;
    getMessages(selectedUser._id);
    return undefined;
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-base-100">
      <ChatHeaderStyled />
      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto bg-base-200/45 p-3 sm:p-5">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="rounded-2xl border border-base-content/10 bg-base-100 px-5 py-3 text-center text-sm text-base-content/50 shadow-sm">
                No messages yet. Say hello 👋
              </div>
            </div>
          )}
          {messages.map((message) => {
            const isMine = String(message.senderId) === String(authUser?._id);
            return (
              <div key={message._id} className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && (
                  <img src={selectedUser?.profilePic || "/avatar.png"} alt="" className="size-8 shrink-0 rounded-xl object-cover" />
                )}
                <div className={`max-w-[82%] sm:max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`overflow-hidden rounded-2xl px-3.5 py-2.5 shadow-sm sm:px-4 ${
                    isMine ? "rounded-br-md bg-primary text-primary-content" : "rounded-bl-md border border-base-content/8 bg-base-100"
                  }`}>
                    {message.image && <img src={message.image} alt="Attachment" className="mb-2 max-h-72 w-full rounded-xl object-cover" />}
                    {message.text && <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.text}</p>}
                  </div>
                  <time className="mt-1 px-1 text-[10px] text-base-content/40">{formatMessageTime(message.createdAt)}</time>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex items-end gap-2">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt="" className="size-8 shrink-0 rounded-xl object-cover" />
              <div className="flex h-10 items-center gap-1 rounded-2xl rounded-bl-md border border-base-content/8 bg-base-100 px-4 shadow-sm" aria-label={`${selectedUser?.fullName} is typing`}>
                <span className="size-1.5 animate-bounce rounded-full bg-base-content/40 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-base-content/40 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-base-content/40" />
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      )}
      <MessageInputStyled />
    </section>
  );
};

export default ChatContainerStyled;
