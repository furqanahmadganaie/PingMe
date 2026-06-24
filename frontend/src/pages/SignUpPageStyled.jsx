import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { createElement, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPageStyled = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Enter a valid email address");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    signup({ ...formData, fullName: formData.fullName.trim(), email: formData.email.trim() });
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
              <h1 className="mt-3 text-3xl font-black tracking-tight">Create your account</h1>
              <p className="text-sm text-base-content/55">Start chatting with the people who matter.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthField label="Full name" icon={User}>
              <input
                className="auth-field"
                placeholder="John Doe"
                autoComplete="name"
                value={formData.fullName}
                onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
              />
            </AuthField>
            <AuthField label="Email address" icon={Mail}>
              <input
                type="email"
                className="auth-field"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
            </AuthField>
            <AuthField label="Password" icon={Lock}>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-field"
                placeholder="At least 6 characters"
                autoComplete="new-password"
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
            </AuthField>

            <button className="btn btn-primary mt-2 h-13 w-full rounded-2xl text-base shadow-lg shadow-primary/20" disabled={isSigningUp}>
              {isSigningUp ? <><Loader2 className="size-5 animate-spin" />Creating account...</> : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay close—wherever life takes you."
      />
    </div>
  );
};

const AuthField = ({ label, icon, children }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold">{label}</label>
    <div className="relative">
      {createElement(icon, { className: "pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-base-content/35" })}
      {children}
    </div>
  </div>
);

export default SignUpPageStyled;
