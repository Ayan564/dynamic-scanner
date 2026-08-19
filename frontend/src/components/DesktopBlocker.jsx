import { Smartphone, MonitorX } from "lucide-react";

export default function DesktopBlocker() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 flex flex-col items-center text-center relative overflow-hidden border border-gray-100">
        {/* Decorative background gradient */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-8 mt-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-100">
              <MonitorX size={32} strokeWidth={1.5} />
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Smartphone size={32} strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-3">
            Mobile Experience Only
          </h1>

          <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
            Dynamic Security Scanner utilizes native device cameras and is
            engineered specifically for mobile platforms.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 w-full">
            <p className="text-[13px] font-semibold text-gray-600">
              Please open this application on your smartphone or tablet to
              proceed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
