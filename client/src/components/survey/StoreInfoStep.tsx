import type { SurveyStoreInfo } from "shared";

interface StoreInfoStepProps {
  data: Partial<SurveyStoreInfo>;
  errors: Record<string, string>;
  onChange: (data: Record<string, unknown>) => void;
}

const STORE_TYPES = ["Drive-Thru", "Dine-In", "Dual-Lane", "Walk-Up"] as const;

export function StoreInfoStep({ data, errors, onChange }: StoreInfoStepProps) {
  const update = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Step 1: Store Information</h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Store ID</label>
        <input
          type="text"
          placeholder="AA-000"
          value={data.storeId ?? ""}
          onChange={(e) => update("storeId", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.storeId ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.storeId && <p className="text-[#FF0000] text-sm mt-1">{errors.storeId}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Store Name</label>
        <input
          type="text"
          placeholder="Main St Drive-Thru"
          value={data.storeName ?? ""}
          onChange={(e) => update("storeName", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.storeName ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.storeName && <p className="text-[#FF0000] text-sm mt-1">{errors.storeName}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Store Address</label>
        <textarea
          placeholder="123 Main St, City, ST 00000"
          value={data.storeAddress ?? ""}
          onChange={(e) => update("storeAddress", e.target.value)}
          className={`w-full min-h-[48px] px-4 py-3 bg-gray-800 border rounded-lg text-white ${
            errors.storeAddress ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.storeAddress && <p className="text-[#FF0000] text-sm mt-1">{errors.storeAddress}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Store Type</label>
        <select
          value={data.storeType ?? ""}
          onChange={(e) => update("storeType", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.storeType ? "border-[#FF0000]" : "border-gray-600"
          }`}
        >
          <option value="">Select type…</option>
          {STORE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.storeType && <p className="text-[#FF0000] text-sm mt-1">{errors.storeType}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
        <input
          type="text"
          placeholder="John Smith"
          value={data.contactName ?? ""}
          onChange={(e) => update("contactName", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.contactName ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.contactName && <p className="text-[#FF0000] text-sm mt-1">{errors.contactName}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Contact Phone</label>
        <input
          type="tel"
          placeholder="+1 555-123-4567"
          value={data.contactPhone ?? ""}
          onChange={(e) => update("contactPhone", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.contactPhone ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.contactPhone && <p className="text-[#FF0000] text-sm mt-1">{errors.contactPhone}</p>}
      </div>
    </div>
  );
}
