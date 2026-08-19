import { useState, useEffect, useRef } from "react";
import { Camera, FileText } from "lucide-react";
import Header from "./components/Header";
import DesktopBlocker from "./components/DesktopBlocker";
import ScanEmptyState from "./components/ScanEmptyState";
import GalleryView from "./components/GalleryView";
import ReviewForm from "./components/ReviewForm";

export default function App() {
  const fileInputRef = useRef(null);
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

  const triggerCamera = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // UPGRADED: Now loops through multiple selected files and compresses all of them
  const handleCapture = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert the FileList object into an array and loop through each file
    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        const img = new Image();
        img.onload = () => {
          // Compress image
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          const canvas = document.createElement("canvas");
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          // Add this compressed image to our state array
          setCapturedImages((prev) => [...prev, compressedBase64]);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    });

    // Reset the input so you can select the exact same files again if needed
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
      const backendUrl = `http://${window.location.hostname}:5000/api/extract`;

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
      alert(
        "Network Error: Could not reach the backend. Ensure your Node server is running on port 5000.",
      );
      setActiveTab("Scan");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMobile) return <DesktopBlocker />;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-white font-sans antialiased select-none">
      <Header />

      {/* UPGRADED: Added the 'multiple' attribute to allow multi-select on desktop */}
      <input
        type="file"
        accept="image/*"
        multiple
        capture="camera"
        ref={fileInputRef}
        onChange={handleCapture}
        className="hidden"
      />

      <main className="flex-grow overflow-y-auto bg-white flex flex-col pb-[96px]">
        {activeTab === "Review" ? (
          <ReviewForm aiData={aiData} isProcessing={isProcessing} />
        ) : capturedImages.length === 0 ? (
          <ScanEmptyState triggerCamera={triggerCamera} />
        ) : (
          <GalleryView
            capturedImages={capturedImages}
            triggerCamera={triggerCamera}
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
