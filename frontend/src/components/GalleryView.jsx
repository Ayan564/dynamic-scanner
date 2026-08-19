import { Plus, X, ArrowRight } from "lucide-react";

export default function GalleryView({
  capturedImages,
  triggerCamera,
  removeImage,
  handleProcessImages,
}) {
  return (
    <div className="px-4 pt-6 pb-6 flex-grow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">
          Scanned Docs
        </h2>
        <span className="text-[13px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {capturedImages.length} items
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {capturedImages.map((img, idx) => (
          <div
            key={idx}
            className="relative group bg-white rounded-3xl shadow-sm border border-gray-100 aspect-[3/4] overflow-hidden"
          >
            <img
              src={img}
              alt={`Scan ${idx}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        <div
          onClick={triggerCamera}
          className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 aspect-[3/4] flex flex-col items-center justify-center cursor-pointer active:bg-gray-100 transition-colors"
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 mb-2">
            <Plus size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[13px] font-semibold text-gray-500">
            Add More
          </span>
        </div>
      </div>

      <button
        onClick={handleProcessImages}
        className="w-full bg-gray-900 text-white rounded-2xl h-14 flex items-center justify-center active:scale-[0.98] transition-all font-bold text-[16px] gap-2 shadow-lg shadow-gray-900/20"
      >
        Extract Data with AI
        <ArrowRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
