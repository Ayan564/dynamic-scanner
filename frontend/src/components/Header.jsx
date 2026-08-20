import { Download } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <header
      className="bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 pb-3 flex items-center gap-3 border-b border-gray-100 shadow-sm"
      // Automatically uses the iPhone/Android status bar size, falling back to 16px if unavailable
      style={{ paddingTop: "max(env(safe-area-inset-top), 16px)" }}
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-slate-900 shrink-0">
        <img
          src="/security.svg"
          alt="Dynamic Security Logo"
          className="w-full h-full object-contain p-1"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h1 className="font-extrabold text-[12px] text-gray-900 tracking-tight leading-snug">
          Dynamic Security And Manpower Services Private Limited
        </h1>
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          Developed by Ayan Maity
        </p>
      </div>

      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="shrink-0 bg-blue-600 text-white border border-blue-700 py-1.5 px-2.5 flex items-center gap-1 text-[10px] font-bold shadow-md active:scale-95 transition-transform rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm"
        >
          <Download size={14} strokeWidth={2.5} />
          Install
        </button>
      )}
    </header>
  );
}
