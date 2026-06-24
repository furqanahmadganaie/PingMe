import { MessageCircle, Send, Sparkles } from "lucide-react";

const NoChatSelectedStyled = () => (
  <div className="hidden flex-1 items-center justify-center overflow-hidden bg-base-200/50 p-8 md:flex">
    <div className="relative max-w-md text-center">
      <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="mx-auto mb-7 flex w-fit items-end gap-2">
          <div className="animate-float grid size-20 place-items-center rounded-[1.75rem] bg-primary text-primary-content shadow-2xl shadow-primary/25">
            <MessageCircle className="size-10" />
          </div>
          <div className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-content shadow-lg">
            <Send className="size-4" />
          </div>
        </div>
        <div className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="size-4" />
          Ready when you are
        </div>
        <h2 className="text-3xl font-black tracking-tight">Your conversations live here</h2>
        <p className="mx-auto mt-4 max-w-sm leading-7 text-base-content/55">Choose someone from your contacts and send a message, a photo, or simply say hello.</p>
      </div>
    </div>
  </div>
);

export default NoChatSelectedStyled;
