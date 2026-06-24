import { ImageIcon, Search, Users, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const SidebarStyled = ({ mobileHidden = false }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users
      .filter((user) => {
        const matchesSearch = user.fullName?.toLowerCase().includes(normalizedQuery);
        const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);
        return matchesSearch && matchesOnline;
      })
      .sort((first, second) => {
        const firstTime = new Date(first.lastMessage?.createdAt || 0).getTime();
        const secondTime = new Date(second.lastMessage?.createdAt || 0).getTime();
        return secondTime - firstTime;
      });
  }, [onlineUsers, query, showOnlineOnly, users]);

  if (isUsersLoading) return <SidebarSkeleton mobileHidden={mobileHidden} />;

  return (
    <aside className={`${mobileHidden ? "hidden md:flex" : "flex"} h-full w-full shrink-0 flex-col border-r border-base-content/10 bg-base-100 md:w-80`}>
      <div className="border-b border-base-content/10 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="font-bold">Messages</h2>
              <p className="text-xs text-base-content/45">{users.length} contacts</p>
            </div>
          </div>
          <span className="badge badge-success badge-sm gap-1 border-0 text-success-content">
            <Wifi className="size-3" />
            {onlineUsers.filter(Boolean).length}
          </span>
        </div>

        <label className="input input-bordered flex h-11 w-full items-center gap-2 rounded-xl bg-base-200/70 focus-within:border-primary">
          <Search className="size-4 text-base-content/35" />
          <input
            className="grow"
            placeholder="Search conversations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl px-1 text-xs text-base-content/55">
          <span>Only show people online</span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={showOnlineOnly}
            onChange={(event) => setShowOnlineOnly(event.target.checked)}
          />
        </label>
      </div>

      <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-2.5">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;
          const unreadCount = user.unreadCount || 0;
          const lastMessage = user.lastMessage;
          const sentByMe = String(lastMessage?.senderId) === String(authUser?._id);
          const preview = lastMessage?.text || (lastMessage?.image ? "Photo" : isOnline ? "Online now" : "Offline");
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                isSelected ? "bg-primary text-primary-content shadow-md shadow-primary/15" : "hover:bg-base-200"
              }`}
            >
              <div className="relative shrink-0">
                <img src={user.profilePic || "/avatar.png"} alt="" className="size-12 rounded-2xl object-cover" />
                <span className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 ${isSelected ? "border-primary" : "border-base-100"} ${isOnline ? "bg-success" : "bg-base-300"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className={`truncate font-semibold ${unreadCount && !isSelected ? "text-base-content" : ""}`}>{user.fullName}</div>
                  {lastMessage?.createdAt && (
                    <time className={`shrink-0 text-[10px] ${isSelected ? "text-primary-content/60" : unreadCount ? "font-bold text-primary" : "text-base-content/35"}`}>
                      {formatSidebarTime(lastMessage.createdAt)}
                    </time>
                  )}
                </div>
                <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                  <div className={`flex min-w-0 items-center gap-1 truncate text-xs ${
                    isSelected ? "text-primary-content/70" : unreadCount ? "font-semibold text-base-content/75" : "text-base-content/45"
                  }`}>
                    {lastMessage?.image && !lastMessage?.text && <ImageIcon className="size-3 shrink-0" />}
                    <span className="truncate">{sentByMe ? "You: " : ""}{preview}</span>
                  </div>
                  {unreadCount > 0 && !isSelected && (
                    <span className="badge badge-primary badge-sm min-w-5 shrink-0 border-0 px-1.5 text-[10px] font-bold text-primary-content">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
            <Search className="mb-3 size-8 text-base-content/20" />
            <p className="font-semibold">No contacts found</p>
            <p className="mt-1 text-xs text-base-content/45">Try a different search or turn off the online filter.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

const formatSidebarTime = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

  if (isToday) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return messageDate.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default SidebarStyled;
