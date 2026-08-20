import { Camera, Image as ImageIcon } from "lucide-react";

export default function ScanEmptyState({ triggerCamera, triggerGallery }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Camera size={40} className="text-blue-500" strokeWidth={1.5} />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Documents</h2>
      <p className="text-gray-500 text-sm mb-10 max-w-xs">
        Take photos of Aadhaar, PAN, and education certificates to auto-fill the
        system.
      </p>

      <div className="flex flex-col w-full gap-4 max-w-xs">
        <button
          onClick={triggerCamera}
          className="w-full bg-blue-600 text-white rounded-2xl h-14 flex items-center justify-center gap-3 font-bold text-[16px] shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
        >
          <Camera size={22} strokeWidth={2.5} />
          Open Camera
        </button>

        <button
          onClick={triggerGallery}
          className="w-full bg-gray-100 text-gray-700 border border-gray-200 rounded-2xl h-14 flex items-center justify-center gap-3 font-bold text-[16px] active:scale-95 transition-transform"
        >
          <ImageIcon size={22} strokeWidth={2.5} />
          Upload from Gallery
        </button>
      </div>
    </div>
  );
}
