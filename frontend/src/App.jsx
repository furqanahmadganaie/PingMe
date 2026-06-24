import { useEffect } from "react";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPageStyled';
import SignUpPage from './pages/SignUpPageStyled';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePageStyled';
import { useAuthStore } from './store/useAuthStore';
import { Loader, MessageSquare } from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import { Routes,Route,Navigate } from 'react-router-dom';
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="app-shell flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/25 blur-xl" />
          <div className="relative grid size-16 place-items-center rounded-2xl bg-primary text-primary-content shadow-xl">
            <MessageSquare className="size-8" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-base-content/60">
          <Loader className="size-4 animate-spin" />
          Loading PingMe
        </div>
      </div>
    );

  return (
   <div className="min-h-screen bg-base-200 text-base-content">
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} replace />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "14px",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
          },
        }}
      />
   </div>
  )
}

export default App
