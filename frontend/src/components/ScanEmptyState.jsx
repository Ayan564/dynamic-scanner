import { ScanLine } from "lucide-react";

export default function ScanEmptyState({ triggerCamera }) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-5 w-full max-w-md mx-auto">
      {/* Sleek Viewfinder Card */}
      <div
        onClick={triggerCamera}
        className="w-full aspect-[4/5] bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-gray-100/50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center text-blue-600 mb-4">
            <ScanLine size={36} strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Tap to Scan
          </h2>
          <p className="text-[13px] text-gray-500 font-medium mt-1">
            Aadhaar, PAN, & Forms
          </p>
        </div>
      </div>

      {/* Instagram-Style Shutter Button */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={triggerCamera}
          className="w-20 h-20 bg-white rounded-full border-[3px] border-gray-200 flex items-center justify-center shadow-sm active:scale-90 transition-all duration-200"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full shadow-inner"></div>
        </button>
      </div>
    </div>
  );
}
