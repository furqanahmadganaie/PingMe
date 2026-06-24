
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navClass = ({ isActive }) =>
    `btn btn-ghost btn-sm gap-2 rounded-xl ${
      isActive ? "bg-primary/10 text-primary" : "text-base-content/65"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-base-content/10 bg-base-100/80 backdrop-blur-xl">
      <div className="mx-auto h-16 max-w-7xl px-3 sm:px-6">
        <div className="flex h-full items-center justify-between">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/20 transition-transform group-hover:-rotate-6 group-hover:scale-105">
              <MessageSquare className="size-5" />
            </div>
            <h1 className="text-lg font-black tracking-tight">
              Ping<span className="text-primary">Me</span>
            </h1>
          </Link>

          <nav className="flex items-center gap-0.5 sm:gap-1">
            <NavLink to="/settings" className={navClass}>
              <Settings className="size-4" />
              <span className="hidden sm:inline">Settings</span>
            </NavLink>

            {authUser && (
              <>
                <NavLink to="/profile" className={navClass}>
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </NavLink>
                <button
                  className="btn btn-ghost btn-sm gap-2 rounded-xl text-base-content/65 hover:bg-error/10 hover:text-error"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
