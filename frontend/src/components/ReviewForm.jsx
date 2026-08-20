import {
  CloudUpload,
  Sparkles,
  CheckCircle2,
  Loader2,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ReviewForm({ aiData, isProcessing }) {
  const [formData, setFormData] = useState({
    name: aiData?.name || "",
    dob: aiData?.dob || "",
    age: "",
    mobile: aiData?.mobile || "",
    address: aiData?.address || "",
    division: aiData?.division || "",
    qualification: aiData?.qualification || "",
    remarks: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (aiData) setFormData((prev) => ({ ...prev, ...aiData }));
  }, [aiData]);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      if (!isNaN(calculatedAge) && calculatedAge > 0) {
        setFormData((prev) =>
          prev.age !== calculatedAge.toString()
            ? { ...prev, age: calculatedAge.toString() }
            : prev,
        );
      }
    }
  }, [formData.dob]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const baseUrl =
        import.meta.env.VITE_BACKEND_URL ||
        `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to sync to Google Sheets.");
    } finally {
      setIsSaving(false);
    }
  };

  // UPGRADED: Custom universal Calendar icon for Date inputs
  const ModernInput = ({ label, name, type = "text", placeholder }) => {
    const isDate = type === "date";

    return (
      <div className="mb-4 w-full">
        <label className="block text-[12px] font-semibold text-gray-500 ml-1 mb-1.5">
          {label}
        </label>
        <div className="relative flex items-center">
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full bg-gray-100 border border-transparent text-gray-900 text-[15px] rounded-2xl px-4 py-3.5 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 font-medium z-10 bg-transparent
              ${isDate ? "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer" : ""}
              ${type === "number" ? "[&::-webkit-inner-spin-button]:hidden" : ""}
            `}
          />

          {/* Custom Calendar Icon injected behind the invisible native input */}
          {isDate && (
            <div className="absolute right-4 text-gray-400 pointer-events-none">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
          )}

          {/* Solid background behind the transparent input to maintain the design */}
          <div className="absolute inset-0 bg-gray-100 rounded-2xl -z-10 transition-colors"></div>
        </div>
      </div>
    );
  };

  const SkeletonInput = ({ heightClass = "h-[52px]" }) => (
    <div className="mb-4 animate-pulse w-full">
      <div className="w-24 h-3 bg-gray-200 rounded-full ml-1 mb-2"></div>
      <div className={`w-full bg-gray-100 rounded-2xl ${heightClass}`}></div>
    </div>
  );

  if (isProcessing) {
    return (
      <div className="px-5 pt-6 pb-6 max-w-md mx-auto flex-grow w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <Sparkles size={20} className="text-blue-400 animate-pulse" />
        </div>
        <SkeletonInput />
        <div className="flex gap-3">
          <div className="flex-[2]">
            <SkeletonInput />
          </div>
          <div className="flex-[1]">
            <SkeletonInput />
          </div>
        </div>
        <SkeletonInput />
        <SkeletonInput heightClass="h-[88px]" />
        <SkeletonInput />
        <SkeletonInput />
        <div className="mt-8 mb-4">
          <SkeletonInput />
        </div>
        <div className="mt-4 w-full h-14 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-6 max-w-md mx-auto flex-grow w-full animate-in fade-in duration-500">
      <h2 className="text-[24px] font-extrabold text-gray-900 tracking-tight mb-6">
        Review Data
      </h2>

      <ModernInput
        label="Full Name"
        name="name"
        placeholder="Name from document"
      />

      <div className="flex gap-3">
        <div className="flex-[2]">
          <ModernInput label="Date of Birth" name="dob" type="date" />
        </div>
        <div className="flex-[1]">
          <ModernInput label="Age" name="age" type="number" placeholder="Yrs" />
        </div>
      </div>

      <ModernInput
        label="Mobile Number"
        name="mobile"
        type="tel"
        placeholder="10-digit number"
      />

      <div className="mb-4">
        <label className="block text-[12px] font-semibold text-gray-500 ml-1 mb-1.5">
          Full Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address from document"
          rows="3"
          className="w-full bg-gray-100 border border-transparent text-gray-900 text-[15px] rounded-2xl px-4 py-3.5 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 font-medium resize-none relative z-10"
        />
      </div>

      <ModernInput
        label="Division Area (Auto-filled)"
        name="division"
        placeholder="Division Area"
      />
      <ModernInput
        label="Education (Optional)"
        name="qualification"
        placeholder="12th Pass, B.A."
      />

      <div className="mt-8 mb-4">
        <ModernInput
          label="Office Remarks"
          name="remarks"
          placeholder="Add specific notes..."
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving || isSuccess}
        className={`mt-4 w-full rounded-2xl h-14 flex items-center justify-center transition-all font-bold text-[16px] gap-2 shadow-lg ${isSuccess ? "bg-green-500 text-white shadow-green-500/30" : "bg-blue-600 text-white shadow-blue-600/30 active:scale-[0.98]"} disabled:opacity-90 disabled:scale-100`}
      >
        {isSaving ? (
          <>
            <Loader2 size={20} strokeWidth={2.5} className="animate-spin" />{" "}
            Syncing...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 size={20} strokeWidth={2.5} /> Data Synced!
          </>
        ) : (
          <>
            <CloudUpload size={20} strokeWidth={2.5} /> Sync to Google Sheets
          </>
        )}
      </button>
    </div>
  );
}
