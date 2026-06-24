import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { playMessageSound } from '../lib/notificationSound';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.error || fallback;
const sameId = (first, second) => String(first) === String(second);
const addMessageOnce = (messages, message) =>
  messages.some((item) => sameId(item._id, message._id)) ? messages : [...messages, message];

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load contacts"));
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set((state) => ({
        messages: res.data,
        users: state.users.map((user) =>
          sameId(user._id, userId) ? { ...user, unreadCount: 0 } : user
        ),
      }));
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load messages"));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser?._id) return;
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => ({
        messages: addMessageOnce(state.messages, res.data),
        users: state.users.map((user) =>
          sameId(user._id, selectedUser._id)
            ? { ...user, lastMessage: res.data }
            : user
        ),
      }));
      return res.data;
    } catch (error) {
      toast.error(getErrorMessage(error, "Message could not be sent"));
      throw error;
    }
  },



  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("profileUpdated");

    socket.on("newMessage", (newMessage) => {
      const isConversationOpen = sameId(newMessage.senderId, get().selectedUser?._id);

      playMessageSound();

      set((state) => ({
        messages: isConversationOpen
          ? addMessageOnce(state.messages, newMessage)
          : state.messages,
        users: state.users.map((user) =>
          sameId(user._id, newMessage.senderId)
            ? {
                ...user,
                lastMessage: newMessage,
                unreadCount: isConversationOpen
                  ? 0
                  : (user.unreadCount || 0) + 1,
              }
            : user
        ),
      }));

      if (isConversationOpen) {
        get().markMessagesAsRead(newMessage.senderId);
      }
    });

    socket.on("typing", ({ senderId, isTyping }) => {
      if (String(senderId) !== String(get().selectedUser?._id)) return;
      set({ isTyping });
    });

    socket.on("profileUpdated", (updatedUser) => {
      set((state) => ({
        users: state.users.map((user) =>
          sameId(user._id, updatedUser._id)
            ? { ...user, ...updatedUser }
            : user
        ),
        selectedUser: sameId(state.selectedUser?._id, updatedUser._id)
          ? { ...state.selectedUser, ...updatedUser }
          : state.selectedUser,
      }));
    });
  },

  sendTypingStatus: (isTyping) => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser?._id || !socket?.connected) return;

    socket.emit("typing", {
      receiverId: selectedUser._id,
      isTyping,
    });
  },

  markMessagesAsRead: async (userId) => {
    if (!userId) return;

    set((state) => ({
      users: state.users.map((user) =>
        sameId(user._id, userId) ? { ...user, unreadCount: 0 } : user
      ),
    }));

    try {
      await axiosInstance.put(`/messages/read/${userId}`);
    } catch (error) {
      console.error("Could not mark messages as read:", error);
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    socket?.off("typing");
    socket?.off("profileUpdated");
    set({ isTyping: false });
  },
  // optimixze it later
  setSelectedUser: (selectedUser) => {
    set({ selectedUser, messages: [], isTyping: false });
    if (selectedUser?._id) get().markMessagesAsRead(selectedUser._id);
  },

}));
