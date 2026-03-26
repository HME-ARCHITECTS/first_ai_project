import { Crosshair } from "lucide-react";

interface MarkingToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export function MarkingToggle({ isActive, onToggle }: MarkingToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`min-w-[64px] min-h-[64px] flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
        isActive
          ? "bg-neon-green text-gray-900"
          : "bg-gray-600 text-white"
      }`}
      aria-label={isActive ? "Marking on" : "Marking off"}
    >
      <Crosshair className="w-6 h-6" />
      {isActive ? "MARKING ON" : "MARKING OFF"}
    </button>
  );
}
