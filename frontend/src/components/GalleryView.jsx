import { Camera, Image as ImageIcon, Trash2, Sparkles } from "lucide-react";

export default function GalleryView({
  capturedImages,
  triggerCamera,
  triggerGallery,
  removeImage,
  handleProcessImages,
}) {
  return (
    <div className="flex flex-col h-full w-full bg-gray-50/30 relative animate-in fade-in duration-300 overflow-hidden">
      {/* Sticky Header - Stays fixed at the top */}
      <div className="flex-shrink-0 sticky top-0 z-40 px-5 pt-5 pb-4 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight">
          Documents
        </h2>
        <p className="text-[12px] font-bold text-gray-500 mt-0.5">
          {capturedImages.length} files attached
        </p>
      </div>

      {/* Scrollable Content Area (Images & Extract Button scroll together underneath the header) */}
      <div className="flex-grow overflow-y-auto px-5 pt-5 pb-40 max-w-md mx-auto w-full">
        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {capturedImages.map((imgSrc, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden shadow-sm aspect-[3/4] bg-white border border-gray-200 ring-1 ring-black/5"
            >
              <img
                src={imgSrc}
                alt={`Scan ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-white/95 backdrop-blur-md text-red-500 p-2 rounded-full shadow-md active:scale-90 transition-transform"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>

        {/* Extract Data Button */}
        <button
          onClick={handleProcessImages}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl h-14 flex items-center justify-center gap-2 font-bold text-[16px] shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-transform border border-blue-500"
        >
          <Sparkles
            size={20}
            strokeWidth={2.5}
            className="text-white drop-shadow-md"
          />
          Extract Data
        </button>
      </div>

      {/* Floating Action Buttons (FAB) - Pinned on bottom right */}
      <div className="fixed right-5 bottom-[calc(64px+env(safe-area-inset-bottom))] z-[60] flex flex-col gap-3">
        {/* Gallery Upload Button */}
        <button
          onClick={triggerGallery}
          className="w-14 h-14 bg-white border border-purple-200 rounded-full flex items-center justify-center text-purple-600 shadow-2xl shadow-purple-500/30 active:scale-90 transition-transform"
          title="Upload from Gallery"
        >
          <ImageIcon size={22} strokeWidth={2.5} />
        </button>

        {/* Camera Capture Button */}
        <button
          onClick={triggerCamera}
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 active:scale-90 transition-transform"
          title="Capture Photo"
        >
          <Camera size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
