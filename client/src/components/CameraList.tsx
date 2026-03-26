import { Camera as CameraIcon, Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { useMarking } from "../context/MarkingContext";
import { apiFetch } from "../lib/api";
import type { Camera } from "shared";
import { useState } from "react";

export function CameraList() {
  const { token, cameras, setCameras, selectCamera } = useMarking();
  const [loading, setLoading] = useState(false);

  const fetchCameras = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiFetch<Camera[]>("/cameras", { token });
      setCameras(data);
    } catch {
      // Toast would show error
    } finally {
      setLoading(false);
    }
  };

  const refreshCameras = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiFetch<Camera[]>("/cameras/refresh", {
        method: "POST",
        token,
      });
      setCameras(data);
    } catch {
      // Toast would show error
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: Camera["status"] }) => {
    switch (status) {
      case "online":
        return <Wifi className="w-5 h-5 text-neon-green" />;
      case "offline":
        return <WifiOff className="w-5 h-5 text-gray-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-safety-red" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CameraIcon className="w-6 h-6" />
          Cameras
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchCameras}
            disabled={loading}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            aria-label="Detect cameras"
          >
            {loading ? "…" : <CameraIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={refreshCameras}
            disabled={loading}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            aria-label="Refresh cameras"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {cameras.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          No cameras detected. Click detect to scan for hardware cameras.
        </p>
      )}

      <div className="space-y-2">
        {cameras.map((camera) => (
          <button
            key={camera.id}
            onClick={() => camera.status === "online" && selectCamera(camera)}
            disabled={camera.status !== "online"}
            className={`w-full min-h-[48px] flex items-center gap-3 p-4 rounded-lg border transition-colors ${
              camera.status === "online"
                ? "border-gray-600 hover:border-neon-green cursor-pointer"
                : "border-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            <StatusIcon status={camera.status} />
            <div className="text-left flex-1">
              <p className="font-medium">{camera.name}</p>
              <p className="text-sm text-gray-400">Slot {camera.slot}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
