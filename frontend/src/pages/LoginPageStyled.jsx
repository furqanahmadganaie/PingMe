import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginPageStyled = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ email: formData.email.trim(), password: formData.password });
  };

  return (
    <div className="app-shell grid min-h-screen pt-16 lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-10 sm:p-12">
        <div className="glass-panel w-full max-w-md rounded-[2rem] p-6 sm:p-9">
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/25">
                <MessageSquare className="size-7" />
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight">Welcome back</h1>
              <p className="text-sm text-base-content/55">Your conversations are waiting for you.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-base-content/35" />
                <input
                  type="email"
                  className="auth-field"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-base-content/35" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-field"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-base-content/40 transition-colors hover:text-primary"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>
            <button className="btn btn-primary mt-2 h-13 w-full rounded-2xl text-base shadow-lg shadow-primary/20" disabled={isLoggingIn}>
              {isLoggingIn ? <><Loader2 className="size-5 animate-spin" />Signing in...</> : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-bold text-primary hover:underline">Create account</Link>
          </p>
        </div>
      </div>
      <AuthImagePattern
        title="Pick up where you left off"
        subtitle="Sign in to continue your conversations and catch up on every moment."
      />
    </div>
  );
};

export default LoginPageStyled;
