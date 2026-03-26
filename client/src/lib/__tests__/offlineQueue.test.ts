import { describe, it, expect, beforeEach, vi } from "vitest";
import { enqueue, flushQueue, getQueueLength } from "../../lib/offlineQueue";

describe("OfflineQueue", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("Q-1: enqueue adds item to storage", () => {
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.5 } });
    expect(getQueueLength()).toBe(1);
  });

  it("Q-2: enqueue multiple items", () => {
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.1 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.2 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.3 } });
    expect(getQueueLength()).toBe(3);
  });

  it("Q-3: flush succeeds removes items", async () => {
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.1 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.2 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.3 } });

    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const result = await flushQueue();
    expect(result).toEqual({ succeeded: 3, failed: 0 });
    expect(getQueueLength()).toBe(0);
  });

  it("Q-4: flush with network error retains items", async () => {
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.1 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.2 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.3 } });

    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network"));

    const result = await flushQueue();
    expect(result).toEqual({ succeeded: 0, failed: 3 });
    expect(getQueueLength()).toBe(3);
  });

  it("Q-5: partial flush keeps failed items", async () => {
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.1 } });
    enqueue({ endpoint: "/api/pois", method: "POST", body: { x: 0.2 } });

    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve({ ok: true });
      return Promise.reject(new Error("Network"));
    });

    const result = await flushQueue();
    expect(result).toEqual({ succeeded: 1, failed: 1 });
    expect(getQueueLength()).toBe(1);
  });

  it("Q-6: empty queue returns zero", async () => {
    const result = await flushQueue();
    expect(result).toEqual({ succeeded: 0, failed: 0 });
  });
});
