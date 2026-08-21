import {
  CloudUpload,
  Sparkles,
  CheckCircle2,
  Loader2,
  Calendar,
  User,
  UserCircle,
  Smartphone,
  MapPin,
  Map,
  GraduationCap,
  AlignLeft,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";

const ModernInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}) => {
  const isDate = type === "date";
  const isTextarea = type === "textarea";

  return (
    <div className="mb-4 w-full">
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5">
        {label}
      </label>
      <div className="relative flex items-center group">
        {/* Left Embedded Icon */}
        <div
          className={`absolute left-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-20 pointer-events-none ${isTextarea ? "top-3.5" : ""}`}
        >
          {icon}
        </div>

        {isTextarea ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows="2"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 outline-none transition-all placeholder:text-gray-300 font-medium shadow-sm resize-none relative z-10"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onClick={(e) =>
              isDate && e.target.showPicker && e.target.showPicker()
            }
            placeholder={placeholder}
            className={`w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 outline-none transition-all placeholder:text-gray-300 font-medium shadow-sm z-10 appearance-none cursor-pointer
              ${isDate ? "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-moz-calendar-picker-indicator]:hidden [&::-webkit-clear-button]:hidden" : ""}
              ${type === "number" ? "[&::-webkit-inner-spin-button]:hidden" : ""}
            `}
          />
        )}

        {/* Right Calendar Indicator for Date Picker */}
        {isDate && (
          <div className="absolute right-4 text-gray-400 pointer-events-none z-20 group-focus-within:text-blue-500">
            <Calendar size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
};

const initialFormData = {
  name: "",
  dob: "",
  age: "",
  gender: "",
  mobile: "",
  address: "",
  division: "",
  qualification: "",
  remarks: "",
};

export default function ReviewForm({ aiData, isProcessing, onSuccessSync }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync incoming extracted AI data into state
  useEffect(() => {
    if (aiData) {
      setFormData((prev) => ({ ...prev, ...aiData }));
    }
  }, [aiData]);

  // Automatic Age Calculation from DOB
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      if (
        today.getMonth() - birthDate.getMonth() < 0 ||
        (today.getMonth() - birthDate.getMonth() === 0 &&
          today.getDate() < birthDate.getDate())
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
      // Smart routing: Uses Render URL if set, defaults to localhost:5000 for local dev, or /api/save for Vercel production
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const endpoint = backendUrl
        ? `${backendUrl}/api/save`
        : import.meta.env.DEV
          ? "http://localhost:5000/api/save"
          : "/api/save";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      setIsSaving(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setFormData(initialFormData);
        if (onSuccessSync) onSuccessSync();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to sync to Google Sheets.");
      setIsSaving(false);
      setIsSuccess(false);
    }
  };

  const SkeletonInput = ({ heightClass = "h-[50px]" }) => (
    <div className="mb-4 animate-pulse w-full">
      <div className="w-20 h-2.5 bg-gray-200 rounded-full ml-1 mb-2"></div>
      <div
        className={`w-full bg-white border border-gray-100 rounded-xl shadow-sm ${heightClass}`}
      ></div>
    </div>
  );

  if (isProcessing) {
    return (
      <div className="px-5 pt-6 pb-32 max-w-md mx-auto flex-grow w-full bg-gray-50/30">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-32 h-7 bg-gray-200 rounded-lg animate-pulse"></div>
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
        <SkeletonInput />
        <SkeletonInput heightClass="h-[76px]" />
        <SkeletonInput />
        <SkeletonInput />
        <SkeletonInput />
        <div className="mt-6 w-full h-14 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-32 max-w-md mx-auto flex-grow w-full bg-gray-50/30 animate-in fade-in duration-300">
      <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight mb-6">
        Review Data
      </h2>

      {/* 1. Full Name */}
      <ModernInput
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Applicant name"
        icon={<User size={18} strokeWidth={2.5} />}
      />

      {/* 2. Date of Birth & Age */}
      <div className="flex gap-3">
        <div className="flex-[2]">
          <ModernInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            icon={<Calendar size={18} strokeWidth={2.5} />}
          />
        </div>
        <div className="flex-[1]">
          <ModernInput
            label="Age"
            name="age"
            type="number"
            placeholder="Yrs"
            value={formData.age}
            onChange={handleChange}
            icon={<Activity size={18} strokeWidth={2.5} />}
          />
        </div>
      </div>

      {/* 3. Gender */}
      <ModernInput
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        placeholder="Male / Female"
        icon={<UserCircle size={18} strokeWidth={2.5} />}
      />

      {/* 4. Mobile Number */}
      <ModernInput
        label="Mobile Number"
        name="mobile"
        type="tel"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="10-digit mobile number"
        icon={<Smartphone size={18} strokeWidth={2.5} />}
      />

      {/* 5. Address */}
      <ModernInput
        label="Full Address"
        name="address"
        type="textarea"
        value={formData.address}
        onChange={handleChange}
        placeholder="Residential address from document"
        icon={<MapPin size={18} strokeWidth={2.5} />}
      />

      {/* 6. Division Area */}
      <ModernInput
        label="Division Area"
        name="division"
        value={formData.division}
        onChange={handleChange}
        placeholder="PIN code area / locality"
        icon={<Map size={18} strokeWidth={2.5} />}
      />

      {/* 7. Education / Qualification */}
      <ModernInput
        label="Education"
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
        placeholder="10th Pass, 12th Pass, B.A."
        icon={<GraduationCap size={18} strokeWidth={2.5} />}
      />

      {/* 8. Remarks */}
      <div className="mb-2">
        <ModernInput
          label="Office Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add specific office notes..."
          icon={<AlignLeft size={18} strokeWidth={2.5} />}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || isSuccess}
        className={`mt-4 w-full rounded-2xl h-14 flex items-center justify-center transition-all font-bold text-[16px] gap-2 shadow-xl ${
          isSuccess
            ? "bg-green-500 text-white shadow-green-500/30"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30 active:scale-[0.98] border border-blue-500"
        } disabled:opacity-90 disabled:scale-100`}
      >
        {isSaving ? (
          <>
            <Loader2 size={20} strokeWidth={2.5} className="animate-spin" />
            <span>Syncing...</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 size={20} strokeWidth={2.5} />
            <span>Data Synced!</span>
          </>
        ) : (
          <>
            <CloudUpload size={20} strokeWidth={2.5} />
            <span>Sync to Google Sheets</span>
          </>
        )}
      </button>
    </div>
  );
}
