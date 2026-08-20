import { useState, useEffect, useRef } from "react";
import { Camera, FileText } from "lucide-react";
import Header from "./components/Header";
import DesktopBlocker from "./components/DesktopBlocker";
import ScanEmptyState from "./components/ScanEmptyState";
import GalleryView from "./components/GalleryView";
import ReviewForm from "./components/ReviewForm";

export default function App() {
  // NEW: Two separate refs for two separate actions
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [capturedImages, setCapturedImages] = useState([]);
  const [activeTab, setActiveTab] = useState("Scan");

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NEW: Two separate trigger functions
  const triggerCameraDirect = () => {
    if (cameraInputRef.current) cameraInputRef.current.click();
  };
  const triggerGalleryDirect = () => {
    if (galleryInputRef.current) galleryInputRef.current.click();
  };

  const handleCapture = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          const canvas = document.createElement("canvas");
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setCapturedImages((prev) => [...prev, compressedBase64]);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setCapturedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleProcessImages = async () => {
    if (capturedImages.length === 0) return;

    setActiveTab("Review");
    setIsProcessing(true);

    try {
      const baseUrl =
        import.meta.env.VITE_BACKEND_URL ||
        `http://${window.location.hostname}:5000`;
      const backendUrl = `${baseUrl}/api/extract`;

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: capturedImages }),
      });

      if (!response.ok) throw new Error("API processing failed");

      const data = await response.json();
      setAiData(data);
    } catch (error) {
      console.error(error);
      alert("Network Error: Could not reach the backend.");
      setActiveTab("Scan");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMobile) return <DesktopBlocker />;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-white font-sans antialiased select-none">
      <Header />

      {/* NEW: Input 1 - Bypasses OS popup, instantly opens the Camera */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleCapture}
        className="hidden"
      />

      {/* NEW: Input 2 - Bypasses OS popup, instantly opens the Gallery with multi-select enabled */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={galleryInputRef}
        onChange={handleCapture}
        className="hidden"
      />

      <main className="flex-grow overflow-y-auto bg-white flex flex-col pb-[96px]">
        {activeTab === "Review" ? (
          <ReviewForm aiData={aiData} isProcessing={isProcessing} />
        ) : capturedImages.length === 0 ? (
          <ScanEmptyState
            triggerCamera={triggerCameraDirect}
            triggerGallery={triggerGalleryDirect}
          />
        ) : (
          <GalleryView
            capturedImages={capturedImages}
            triggerCamera={triggerCameraDirect}
            triggerGallery={triggerGalleryDirect}
            removeImage={removeImage}
            handleProcessImages={handleProcessImages}
          />
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-white/85 backdrop-blur-xl border-t border-gray-100 pb-8 pt-3 px-8 flex justify-around items-center z-50">
        <button
          onClick={() => setActiveTab("Scan")}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === "Scan" ? "text-blue-600" : "text-gray-400"}`}
        >
          <Camera size={26} strokeWidth={activeTab === "Scan" ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide">SCANNER</span>
        </button>
        <button
          onClick={() => setActiveTab("Review")}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === "Review" ? "text-blue-600" : "text-gray-400"}`}
        >
          <div className="relative">
            <FileText
              size={26}
              strokeWidth={activeTab === "Review" ? 2.5 : 2}
            />
            {capturedImages.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {capturedImages.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wide">REVIEW</span>
        </button>
      </nav>
    </div>
  );
}
