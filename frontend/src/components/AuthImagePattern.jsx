import { Heart, Image, MessageCircle, Sparkles, Users } from "lucide-react";
import { createElement } from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  const cards = [
    { icon: Users, className: "col-span-2 bg-primary text-primary-content" },
    { icon: Heart, className: "bg-secondary text-secondary-content" },
    { icon: MessageCircle, className: "bg-base-100 text-primary" },
    { icon: Image, className: "col-span-2 bg-accent text-accent-content" },
  ];

  return (
    <div className="relative hidden overflow-hidden border-l border-base-content/10 bg-base-200 lg:flex lg:items-center lg:justify-center lg:p-12">
      <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-secondary/15 blur-3xl" />
      <div className="relative max-w-lg text-center">
        <div className="mb-10 grid grid-cols-3 gap-4">
          {cards.map(({ icon, className }, index) => (
            <div
              key={index}
              className={`animate-float grid aspect-square place-items-center rounded-3xl shadow-xl ${className}`}
              style={{ animationDelay: `${index * 250}ms` }}
            >
              {createElement(icon, { className: "size-10", strokeWidth: 1.7 })}
            </div>
          ))}
        </div>
        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="size-4" />
          Better conversations
        </div>
        <h2 className="mb-4 text-3xl font-black tracking-tight">{title}</h2>
        <p className="mx-auto max-w-md text-base leading-7 text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
