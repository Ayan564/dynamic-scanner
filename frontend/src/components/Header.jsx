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
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 pt-10 pb-4 flex flex-col items-center justify-center border-b border-gray-100 shadow-sm relative">
      {/* NEW: Tilted Corner Rectangle Button */}
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="absolute top-10 right-4 bg-blue-600 text-white border border-blue-700 py-1.5 px-3 flex items-center gap-1.5 text-[11px] font-bold shadow-md active:scale-95 transition-transform rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm"
        >
          <Download size={14} strokeWidth={2.5} />
          Install App
        </button>
      )}

      <div className="w-20 h-20 mb-3 rounded-2xl overflow-hidden border border-gray-200 shadow-md flex items-center justify-center bg-slate-900 relative">
        <img
          src="/security.svg"
          alt="Dynamic Security Logo"
          className="w-full h-full object-contain p-1"
        />
      </div>

      <h1 className="font-extrabold text-[15px] text-gray-900 tracking-tight text-center leading-tight px-2 mt-1">
        Dynamic Security And Manpower Services Private Limited
      </h1>

      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">
        Developed by Ayan Maity
      </p>
    </header>
  );
}
