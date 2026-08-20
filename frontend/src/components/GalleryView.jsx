import { Camera, Image as ImageIcon, Trash2, Sparkles } from "lucide-react";

export default function GalleryView({
  capturedImages,
  triggerCamera,
  triggerGallery,
  removeImage,
  handleProcessImages,
}) {
  return (
    <div className="px-5 pt-6 pb-6 flex-grow flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight">
          Scanned Documents{" "}
          <span className="text-blue-600 ml-1">({capturedImages.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 hide-scrollbar flex-grow">
        {capturedImages.map((imgSrc, index) => (
          <div
            key={index}
            className="relative group rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm aspect-[3/4] bg-gray-50"
          >
            <img
              src={imgSrc}
              alt={`Scan ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"
            >
              <Trash2 size={16} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {/* Split "Add More" buttons in the grid */}
        <div className="flex flex-col gap-2 h-full aspect-[3/4]">
          <button
            onClick={triggerCamera}
            className="flex-1 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center text-blue-500 bg-blue-50/50 active:bg-blue-50 transition-colors"
          >
            <Camera size={24} className="mb-1" />
            <span className="text-[11px] font-bold">Camera</span>
          </button>

          <button
            onClick={triggerGallery}
            className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-600 bg-gray-50/50 active:bg-gray-100 transition-colors"
          >
            <ImageIcon size={24} className="mb-1" />
            <span className="text-[11px] font-bold">Gallery</span>
          </button>
        </div>
      </div>

      <button
        onClick={handleProcessImages}
        className="mt-2 w-full bg-gray-900 text-white rounded-2xl h-14 flex items-center justify-center gap-2 font-bold text-[16px] shadow-lg active:scale-[0.98] transition-transform"
      >
        <Sparkles size={20} strokeWidth={2.5} className="text-blue-400" />
        Extract Data with AI
      </button>
    </div>
  );
}
