import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/SidebarStyled";
import ChatContainer from "../components/ChatContainerStyled";
import NoChatSelected from "../components/NoChatSelectedStyled";


const Homepage = () => {
 const { selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
 const { socket } = useAuthStore();

 useEffect(() => {
   if (!socket) return undefined;
   subscribeToMessages();
   return unsubscribeFromMessages;
 }, [socket, subscribeToMessages, unsubscribeFromMessages]);

  return (
    <main className="app-shell h-[100dvh] overflow-hidden px-0 pb-0 pt-16 sm:px-4 sm:pb-4 sm:pt-20">
      <div className="glass-panel mx-auto h-full max-w-7xl overflow-hidden sm:rounded-[1.75rem]">
        <div className="flex h-full overflow-hidden">
            <Sidebar mobileHidden={Boolean(selectedUser)} />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </main>
  )
}

export default Homepage
