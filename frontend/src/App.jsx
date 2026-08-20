import { useState, useEffect, useRef } from "react";
import { Camera, FileText } from "lucide-react";
import Header from "./components/Header";
import DesktopBlocker from "./components/DesktopBlocker";
import ScanEmptyState from "./components/ScanEmptyState";
import GalleryView from "./components/GalleryView";
import ReviewForm from "./components/ReviewForm";

export default function App() {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [capturedImages, setCapturedImages] = useState([]);
  const [activeTab, setActiveTab] = useState("Scan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiData, setAiData] = useState(null);

  const [touchStart, setTouchStart] = useState({ x: null, y: null });
  const [touchEnd, setTouchEnd] = useState({ x: null, y: null });

  useEffect(() => {
    // Wake up Render backend if configured; otherwise safely ignored
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (backendUrl) {
      fetch(`${backendUrl}/api/wakeup`).catch(() =>
        console.log("Waking backend..."),
      );
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          setCapturedImages((prev) => [
            ...prev,
            canvas.toDataURL("image/jpeg", 0.7),
          ]);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  const removeImage = (indexToRemove) =>
    setCapturedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );

  const handleProcessImages = async () => {
    if (capturedImages.length === 0) return;
    setActiveTab("Review");
    setIsProcessing(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const endpoint = backendUrl
        ? `${backendUrl}/api/extract`
        : "/api/extract";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: capturedImages }),
      });

      if (!response.ok) throw new Error("API Request Failed");
      const data = await response.json();
      setAiData(data);
    } catch (error) {
      console.error(error);
      alert("Extraction failed. Please try again.");
      setActiveTab("Scan");
    } finally {
      setIsProcessing(false);
    }
  };

  // Touch handlers for horizontal swipe navigation
  const onTouchStart = (e) => {
    setTouchEnd({ x: null, y: null });
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };
  const onTouchMove = (e) =>
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  const onTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > 45 && activeTab === "Scan") setActiveTab("Review");
      if (distanceX < -45 && activeTab === "Review") setActiveTab("Scan");
    }
  };

  if (!isMobile) return <DesktopBlocker />;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-gray-50 font-sans antialiased select-none relative">
      <Header />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleCapture}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        multiple
        ref={galleryInputRef}
        onChange={handleCapture}
        className="hidden"
      />

      <main
        className="flex-grow overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform:
              activeTab === "Review" ? "translateX(-100%)" : "translateX(0)",
          }}
        >
          {/* Scan Tab Pane */}
          <div className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col relative bg-white">
            {capturedImages.length === 0 ? (
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
          </div>

          {/* Review Tab Pane */}
          <div className="w-full h-full flex-shrink-0 overflow-y-auto flex flex-col relative bg-white">
            <ReviewForm
              aiData={aiData}
              isProcessing={isProcessing}
              onSuccessSync={() => {
                setCapturedImages([]);
                setAiData(null);
                setActiveTab("Scan");
              }}
            />
          </div>
        </div>
      </main>

      {/* YouTube-Style Clean Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-[52px]">
          <button
            onClick={() => setActiveTab("Scan")}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full"
          >
            <Camera
              size={24}
              strokeWidth={activeTab === "Scan" ? 2.5 : 1.5}
              className={activeTab === "Scan" ? "text-black" : "text-gray-400"}
            />
            <span
              className={`text-[10px] tracking-wide ${activeTab === "Scan" ? "font-medium text-black" : "font-normal text-gray-500"}`}
            >
              Scan
            </span>
          </button>
          <button
            onClick={() => setActiveTab("Review")}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full"
          >
            <div className="relative">
              <FileText
                size={24}
                strokeWidth={activeTab === "Review" ? 2.5 : 1.5}
                className={
                  activeTab === "Review" ? "text-black" : "text-gray-400"
                }
              />
              {capturedImages.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {capturedImages.length}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-wide ${activeTab === "Review" ? "font-medium text-black" : "font-normal text-gray-500"}`}
            >
              Review
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
