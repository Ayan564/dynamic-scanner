import { Camera, Image as ImageIcon, Trash2, Sparkles } from "lucide-react";

export default function GalleryView({
  capturedImages,
  triggerCamera,
  triggerGallery,
  removeImage,
  handleProcessImages,
}) {
  return (
    <div className="flex flex-col bg-gray-50/30 animate-in fade-in duration-300 w-full min-h-full relative">
      {/* Sticky Header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between bg-white/90 backdrop-blur-lg sticky top-0 z-30 border-b border-gray-200/60 shadow-sm">
        <div>
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight leading-tight">
            Documents
          </h2>
          <p className="text-[12px] font-bold text-gray-500">
            {capturedImages.length} files attached
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={triggerCamera}
            className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 shadow-sm shadow-blue-500/10 active:scale-90 transition-transform"
          >
            <Camera size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={triggerGallery}
            className="w-11 h-11 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-full flex items-center justify-center text-purple-600 shadow-sm shadow-purple-500/10 active:scale-90 transition-transform"
          >
            <ImageIcon size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="px-5 pt-5 pb-6 grid grid-cols-2 gap-4 content-start">
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

      {/* Extract Button - Now scrolls naturally at the end of the document list */}
      <div className="px-5 mt-2 w-full pb-[calc(80px+env(safe-area-inset-bottom))]">
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
    </div>
  );
}
