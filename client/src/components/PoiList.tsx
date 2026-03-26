import { MapPin, Trash2 } from "lucide-react";
import { useMarking } from "../context/MarkingContext";

export function PoiList() {
  const { pois, removePoi } = useMarking();

  if (pois.length === 0) {
    return (
      <p className="text-gray-400 text-center text-sm py-2">
        No detection points marked yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        Detection Points ({pois.length})
      </h3>
      <ul className="space-y-1">
        {pois.map((poi, index) => (
          <li
            key={poi.id}
            className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
          >
            <span className="text-sm">
              <span className="text-safety-red font-bold mr-2">#{index + 1}</span>
              x: {poi.x.toFixed(3)}, y: {poi.y.toFixed(3)}
            </span>
            <button
              onClick={() => removePoi(poi.id)}
              className="min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-400 hover:text-safety-red"
              aria-label={`Remove point ${index + 1}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
