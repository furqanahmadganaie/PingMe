import { create } from "zustand";

const storedTheme = typeof window !== "undefined" ? localStorage.getItem("pingme-theme") : null;

export const useThemeStore = create((set) => ({
  theme: storedTheme || "light",
  setTheme: (theme) => {
    localStorage.setItem("pingme-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
