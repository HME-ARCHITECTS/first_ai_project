import type { SurveyNetwork } from "shared";

interface NetworkStepProps {
  data: Partial<SurveyNetwork>;
  errors: Record<string, string>;
  onChange: (data: Record<string, unknown>) => void;
}

const CONNECTION_TYPES = ["Ethernet", "Wi-Fi", "Cellular"] as const;
const IP_ASSIGNMENTS = ["DHCP", "Static"] as const;
const POWER_SOURCES = ["PoE", "AC-Adapter", "UPS-Backed"] as const;

export function NetworkStep({ data, errors, onChange }: NetworkStepProps) {
  const update = (field: string, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Step 3: Network & Power</h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Connection Type</label>
        <select
          value={data.connectionType ?? ""}
          onChange={(e) => update("connectionType", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.connectionType ? "border-[#FF0000]" : "border-gray-600"
          }`}
        >
          <option value="">Select connection…</option>
          {CONNECTION_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.connectionType && <p className="text-[#FF0000] text-sm mt-1">{errors.connectionType}</p>}
      </div>

      {data.connectionType === "Wi-Fi" && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Network SSID</label>
          <input
            type="text"
            placeholder="StoreWiFi-5G"
            value={data.networkSsid ?? ""}
            onChange={(e) => update("networkSsid", e.target.value)}
            className="w-full min-h-[48px] px-4 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">IP Assignment</label>
        <select
          value={data.ipAssignment ?? ""}
          onChange={(e) => update("ipAssignment", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.ipAssignment ? "border-[#FF0000]" : "border-gray-600"
          }`}
        >
          <option value="">Select IP assignment…</option>
          {IP_ASSIGNMENTS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.ipAssignment && <p className="text-[#FF0000] text-sm mt-1">{errors.ipAssignment}</p>}
      </div>

      {data.ipAssignment === "Static" && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Static IP</label>
          <input
            type="text"
            placeholder="192.168.1.100"
            value={data.staticIp ?? ""}
            onChange={(e) => update("staticIp", e.target.value)}
            className="w-full min-h-[48px] px-4 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Internet Speed</label>
        <input
          type="text"
          placeholder="50 Mbps"
          value={data.internetSpeed ?? ""}
          onChange={(e) => update("internetSpeed", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.internetSpeed ? "border-[#FF0000]" : "border-gray-600"
          }`}
        />
        {errors.internetSpeed && <p className="text-[#FF0000] text-sm mt-1">{errors.internetSpeed}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Power Source</label>
        <select
          value={data.powerSource ?? ""}
          onChange={(e) => update("powerSource", e.target.value)}
          className={`w-full min-h-[48px] px-4 bg-gray-800 border rounded-lg text-white ${
            errors.powerSource ? "border-[#FF0000]" : "border-gray-600"
          }`}
        >
          <option value="">Select power source…</option>
          {POWER_SOURCES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.powerSource && <p className="text-[#FF0000] text-sm mt-1">{errors.powerSource}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update("upsAvailable", !data.upsAvailable)}
          className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg flex items-center justify-center ${
            data.upsAvailable ? "bg-[#39FF14] text-black" : "bg-gray-600 text-white"
          }`}
        >
          {data.upsAvailable ? "ON" : "OFF"}
        </button>
        <label className="text-sm text-gray-400">UPS Available</label>
      </div>
    </div>
  );
}
