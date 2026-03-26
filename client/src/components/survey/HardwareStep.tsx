import type { SurveyHardware } from "shared";

interface HardwareStepProps {
  data: Partial<SurveyHardware>;
  errors: Record<string, string>;
  onChange: (data: Record<string, unknown>) => void;
}

const MOUNT_TYPES = ["Ceiling", "Wall", "Pole", "Gooseneck"] as const;

export function HardwareStep({ data, errors, onChange }: HardwareStepProps) {
  const update = (field: string, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Step 2: Hardware Inventory</h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Camera Count</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1"
          value={data.cameraCount ?? ""}
          onChange={(e) => update("cameraCount", parseInt(e.target.value) || 0)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.cameraCount ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.cameraCount && <p className="text-[#FF0000] text-sm mt-1">{errors.cameraCount}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Camera Model</label>
        <input
          type="text"
          placeholder="VisionAI Cam Pro"
          value={data.cameraModel ?? ""}
          onChange={(e) => update("cameraModel", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.cameraModel ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.cameraModel && <p className="text-[#FF0000] text-sm mt-1">{errors.cameraModel}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Mount Type</label>
        <select
          value={data.mountType ?? ""}
          onChange={(e) => update("mountType", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.mountType ? "border-[#FF0000]" : "border-gray-600"
          }`}
        >
          <option value="">Select mount type…</option>
          {MOUNT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.mountType && <p className="text-[#FF0000] text-sm mt-1">{errors.mountType}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Processing Unit Model</label>
        <input
          type="text"
          placeholder="VisionAI Edge 200"
          value={data.processingUnitModel ?? ""}
          onChange={(e) => update("processingUnitModel", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.processingUnitModel ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.processingUnitModel && <p className="text-[#FF0000] text-sm mt-1">{errors.processingUnitModel}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Processing Unit Serial</label>
        <input
          type="text"
          placeholder="SN-12345-ABCDE"
          value={data.processingUnitSerial ?? ""}
          onChange={(e) => update("processingUnitSerial", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.processingUnitSerial ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.processingUnitSerial && <p className="text-[#FF0000] text-sm mt-1">{errors.processingUnitSerial}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Firmware Version</label>
        <input
          type="text"
          placeholder="v2.4.1"
          value={data.firmwareVersion ?? ""}
          onChange={(e) => update("firmwareVersion", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.firmwareVersion ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.firmwareVersion && <p className="text-[#FF0000] text-sm mt-1">{errors.firmwareVersion}</p>}
      </div>
    </div>
  );
}
