import { useMarking } from "../../context/MarkingContext";
import type { SurveyCameraPlacement } from "shared";

interface CameraPlacementStepProps {
  data: SurveyCameraPlacement[];
  errors: Record<string, string>;
  onChange: (data: SurveyCameraPlacement[]) => void;
}

const ANGLES = ["Overhead", "Side-View", "Angled-Down"] as const;
const FOV = ["Narrow", "Standard", "Wide"] as const;

export function CameraPlacementStep({ data, errors, onChange }: CameraPlacementStepProps) {
  const { cameras, pois } = useMarking();

  // Build a card per camera, pre-fill from Spec 01 data
  const placements: SurveyCameraPlacement[] = cameras.length > 0
    ? cameras.map((cam) => {
        const existing = data.find((d) => d.cameraId === cam.id);
        const poiCount = pois.filter((p) => p.cameraId === cam.id).length;
        return {
          cameraId: cam.id,
          cameraName: existing?.cameraName ?? cam.name,
          mountHeight: existing?.mountHeight ?? 10,
          angle: existing?.angle ?? "Overhead",
          fieldOfView: existing?.fieldOfView ?? "Standard",
          poiCount,
          notes: existing?.notes ?? "",
        };
      })
    : data.length > 0
      ? data
      : [{
          cameraId: crypto.randomUUID(),
          cameraName: "",
          mountHeight: 10,
          angle: "Overhead" as const,
          fieldOfView: "Standard" as const,
          poiCount: 0,
          notes: "",
        }];

  const updatePlacement = (index: number, field: string, value: string | number) => {
    const updated = [...placements];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Step 4: Camera Placement</h2>
      {errors.camerasPlacements && (
        <p className="text-[#FF0000] text-sm">{errors.camerasPlacements}</p>
      )}

      {placements.map((placement, i) => (
        <div key={placement.cameraId} className="border border-gray-600 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-lg">Camera {i + 1}</h3>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Camera Name</label>
            <input
              type="text"
              value={placement.cameraName}
              onChange={(e) => updatePlacement(i, "cameraName", e.target.value)}
              className="w-full min-h-[48px] px-4 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Mount Height (ft)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="10"
              value={placement.mountHeight}
              onChange={(e) => updatePlacement(i, "mountHeight", parseFloat(e.target.value) || 0)}
              className="w-full min-h-[48px] px-4 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Angle</label>
            <select
              value={placement.angle}
              onChange={(e) => updatePlacement(i, "angle", e.target.value)}
              className="w-full min-h-[48px] px-4 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              {ANGLES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Field of View</label>
            <select
              value={placement.fieldOfView}
              onChange={(e) => updatePlacement(i, "fieldOfView", e.target.value)}
              className="w-full min-h-[48px] px-4 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              {FOV.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>POIs marked: <strong className="text-white">{placement.poiCount}</strong></span>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              placeholder="Positioned above order board"
              value={placement.notes ?? ""}
              onChange={(e) => updatePlacement(i, "notes", e.target.value)}
              className="w-full min-h-[48px] px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
