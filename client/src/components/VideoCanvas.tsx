import { useRef, useEffect, useCallback } from "react";
import { useMarking } from "../context/MarkingContext";
import { toNormalizedCoords } from "../lib/coordinateMapper";
import { renderPins } from "../lib/pinRenderer";
import { apiFetch } from "../lib/api";
import { enqueue } from "../lib/offlineQueue";
import type { PointOfInterest } from "shared";

export function VideoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedCamera, pois, isMarkingMode, addPoi, token, isOnline } = useMarking();

  // Render pins whenever pois change
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderPins(ctx, pois, rect);
  }, [pois]);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isMarkingMode || !selectedCamera) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const { x, y } = toNormalizedCoords(e.clientX, e.clientY, rect);

      const poi: PointOfInterest = {
        id: crypto.randomUUID(),
        cameraId: selectedCamera.id,
        x,
        y,
        timestamp: new Date().toISOString(),
        location: { lat: 0, lng: 0 }, // GPS would come from device
      };

      addPoi(poi);

      // Send to server or queue offline
      if (isOnline && token) {
        try {
          await apiFetch("/pois", { method: "POST", body: poi, token });
        } catch {
          enqueue({ endpoint: "/api/pois", method: "POST", body: poi });
        }
      } else {
        enqueue({ endpoint: "/api/pois", method: "POST", body: poi });
      }
    },
    [isMarkingMode, selectedCamera, addPoi, token, isOnline]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden"
    >
      <video
        src={selectedCamera?.streamUrl ?? "/input/2026-02-27T07_46_47-08_00.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className={`absolute inset-0 w-full h-full ${
          isMarkingMode ? "cursor-crosshair" : "cursor-default"
        }`}
        data-testid="marking-canvas"
      />
    </div>
  );
}
