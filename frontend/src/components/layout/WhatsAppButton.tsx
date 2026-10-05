import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { CONTACT } from "@/lib/site";

const PREFILL = encodeURIComponent(
  "Hi Career Vision, I'd like guidance on choosing a course and college. Please help me.",
);

/** Floating WhatsApp CTA shown on every page (mounted once in App.tsx). */
export default function WhatsAppButton() {
  const [showHint, setShowHint] = useState(false);

  // Nudge the hint bubble in after a moment so it doesn't fight the hero for attention.
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-end gap-2.5 sm:bottom-6 sm:right-6">
      {showHint && (
        <div
          data-testid="whatsapp-hint-bubble"
          className="relative mb-1 max-w-[190px] rounded-2xl rounded-br-sm border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_8px_30px_-8px_rgba(4,25,78,0.35)]"
        >
          <button
            type="button"
            aria-label="Dismiss WhatsApp message"
            data-testid="whatsapp-hint-close-btn"
            onClick={() => setShowHint(false)}
            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-slate-200 bg-white text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" />
          </button>
          <p className="text-xs font-bold leading-snug text-foreground">
            Questions about admission?
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            Chat with a counselor on WhatsApp — it's free.
          </p>
        </div>
      )}

      <a
        href={`${CONTACT.whatsapp}?text=${PREFILL}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Career Vision on WhatsApp"
        data-testid="floating-whatsapp-btn"
        className="group relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.7)] transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95"
      >
        {/* Pulse ring — purely decorative */}
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25"
          style={{ animationDuration: "2.5s" }}
        />
        <SiWhatsapp className="relative size-7" />
      </a>
    </div>
  );
}
