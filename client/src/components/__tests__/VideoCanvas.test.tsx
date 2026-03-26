import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoCanvas } from "../../components/VideoCanvas";
import { MarkingProvider } from "../../context/MarkingContext";

// Mock the canvas context
const mockGetContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  set fillStyle(_: string) {},
  set strokeStyle(_: string) {},
  set lineWidth(_: number) {},
  set font(_: string) {},
  set textAlign(_: string) {},
  set textBaseline(_: string) {},
});

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = mockGetContext;
  // Seed localStorage with a selected camera so VideoCanvas renders
  localStorage.setItem(
    "vision-ai-session",
    JSON.stringify({
      token: "test-token",
      installerId: "INST-12345",
      cameras: [],
      selectedCamera: {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        name: "Test Camera",
        slot: 1,
        status: "online",
        streamUrl: "http://localhost:8080/stream/video0",
      },
      pois: [],
      isMarkingMode: false,
      isOnline: true,
    })
  );
});

function renderWithProvider() {
  return render(
    <MarkingProvider>
      <VideoCanvas />
    </MarkingProvider>
  );
}

describe("VideoCanvas", () => {
  it("V-1: renders video element", () => {
    renderWithProvider();
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
  });

  it("V-2: canvas overlay is present", () => {
    renderWithProvider();
    const canvas = screen.getByTestId("marking-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe("CANVAS");
  });

  it("V-3: canvas has correct cursor when not marking", () => {
    renderWithProvider();
    const canvas = screen.getByTestId("marking-canvas");
    expect(canvas.className).toContain("cursor-default");
  });

  it("V-4: container has aspect-video class for 16:9", () => {
    renderWithProvider();
    const canvas = screen.getByTestId("marking-canvas");
    const container = canvas.parentElement;
    expect(container?.className).toContain("aspect-video");
  });

  it("V-5: click on canvas does not throw", () => {
    renderWithProvider();
    const canvas = screen.getByTestId("marking-canvas");
    expect(() => fireEvent.click(canvas)).not.toThrow();
  });
});
