import type { PointOfInterest } from "shared";

export function renderPins(
  ctx: CanvasRenderingContext2D,
  pois: PointOfInterest[],
  rect: DOMRect
): void {
  ctx.clearRect(0, 0, rect.width, rect.height);

  pois.forEach((poi, index) => {
    const px = poi.x * rect.width;
    const py = poi.y * rect.height;

    // Circle: 12px radius, Safety Red fill, 2px white border
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label: index number centered in circle
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1), px, py);
  });
}
