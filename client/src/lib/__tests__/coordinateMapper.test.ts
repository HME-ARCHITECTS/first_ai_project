import { describe, it, expect } from "vitest";
import { toNormalizedCoords, toPixelCoords } from "../../lib/coordinateMapper";

// Helper to create a mock DOMRect
function mockRect(x: number, y: number, width: number, height: number): DOMRect {
  return {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    toJSON: () => ({}),
  };
}

describe("toNormalizedCoords", () => {
  const rect = mockRect(0, 0, 800, 450);

  it("C-1: center click returns (0.5, 0.5)", () => {
    const result = toNormalizedCoords(400, 225, rect);
    expect(result.x).toBeCloseTo(0.5);
    expect(result.y).toBeCloseTo(0.5);
  });

  it("C-2: top-left corner returns (0, 0)", () => {
    const result = toNormalizedCoords(0, 0, rect);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("C-3: bottom-right corner returns (1, 1)", () => {
    const result = toNormalizedCoords(800, 450, rect);
    expect(result.x).toBe(1);
    expect(result.y).toBe(1);
  });

  it("C-4: click outside element clamps to 0", () => {
    const result = toNormalizedCoords(-50, -50, rect);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("C-5: click beyond element clamps to 1", () => {
    const result = toNormalizedCoords(1000, 600, rect);
    expect(result.x).toBe(1);
    expect(result.y).toBe(1);
  });

  it("C-6: offset element calculates correctly", () => {
    const offsetRect = mockRect(100, 100, 800, 450);
    const result = toNormalizedCoords(300, 212.5, offsetRect);
    expect(result.x).toBeCloseTo(0.25);
    expect(result.y).toBeCloseTo(0.25);
  });
});

describe("toPixelCoords", () => {
  const rect = mockRect(0, 0, 800, 450);

  it("C-7: toPixelCoords roundtrips correctly", () => {
    const result = toPixelCoords(0.5, 0.5, rect);
    expect(result.px).toBe(400);
    expect(result.py).toBe(225);
  });
});
