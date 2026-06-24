import { Check, MonitorSmartphone, Palette } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <main className="app-shell min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Palette className="size-5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Make PingMe yours</h1>
          <p className="mt-2 max-w-xl text-base-content/55">Choose a theme that feels right. Your preference is saved on this device.</p>
        </div>

        <section className="glass-panel rounded-[2rem] p-5 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <MonitorSmartphone className="size-5 text-primary" />
            <div>
              <h2 className="font-bold">Appearance</h2>
              <p className="text-xs text-base-content/45">Preview and apply instantly</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {THEMES.map((item) => (
              <button
                key={item.name}
                className={`group relative rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                  theme === item.name ? "border-primary bg-primary/8 ring-2 ring-primary/15" : "border-base-content/10 bg-base-100"
                }`}
                onClick={() => setTheme(item.name)}
              >
                <div className="mb-3 flex h-16 overflow-hidden rounded-xl border border-black/5">
                  {item.colors.map((color) => <span key={color} className="flex-1" style={{ backgroundColor: color }} />)}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{item.label}</span>
                  {theme === item.name && <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-content"><Check className="size-3" /></span>}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default SettingsPage;
