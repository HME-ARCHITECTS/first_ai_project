export function toNormalizedCoords(
  clientX: number,
  clientY: number,
  rect: DOMRect
): { x: number; y: number } {
  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  return { x, y };
}

export function toPixelCoords(
  normX: number,
  normY: number,
  rect: DOMRect
): { px: number; py: number } {
  return {
    px: normX * rect.width,
    py: normY * rect.height,
  };
}
