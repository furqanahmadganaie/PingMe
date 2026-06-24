import { ImagePlus, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInputStyled = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const { sendMessage, sendTypingStatus, selectedUser } = useChatStore();

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      sendTypingStatus(false);
      isTypingRef.current = false;
    }
  }, [sendTypingStatus]);

  const handleTextChange = (event) => {
    const nextText = event.target.value;
    setText(nextText);

    if (!nextText.trim()) {
      stopTyping();
      return;
    }

    if (!isTypingRef.current) {
      sendTypingStatus(true);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 1200);
  };

  useEffect(() => {
    setText("");
    stopTyping();
    return stopTyping;
  }, [selectedUser?._id, stopTyping]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if ((!text.trim() && !imagePreview) || isSending) return;
    stopTyping();
    setIsSending(true);
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      removeImage();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="safe-bottom shrink-0 border-t border-base-content/10 bg-base-100 p-3 sm:p-4">
      {imagePreview && (
        <div className="mb-3 inline-block">
          <div className="relative">
            <img src={imagePreview} alt="Upload preview" className="size-20 rounded-2xl border border-base-content/10 object-cover shadow" />
            <button type="button" onClick={removeImage} className="btn btn-circle btn-xs absolute -right-2 -top-2 bg-base-content text-base-100" aria-label="Remove image">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        <button type="button" className={`btn btn-ghost btn-circle shrink-0 ${imagePreview ? "text-primary" : "text-base-content/45"}`} onClick={() => fileInputRef.current?.click()} aria-label="Attach image">
          <ImagePlus className="size-5" />
        </button>
        <input
          className="input input-bordered h-12 min-w-0 flex-1 rounded-2xl bg-base-200/70 px-4 focus:border-primary"
          placeholder="Write a message..."
          value={text}
          onChange={handleTextChange}
        />
        <button type="submit" className="btn btn-primary btn-circle shrink-0 shadow-md shadow-primary/20" disabled={(!text.trim() && !imagePreview) || isSending} aria-label="Send message">
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInputStyled;
