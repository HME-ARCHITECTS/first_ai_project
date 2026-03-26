interface QueuedRequest {
  id: string;
  endpoint: string;
  method: "POST";
  body: unknown;
  createdAt: string;
  retries: number;
}

const STORAGE_KEY = "vision-ai-offline-queue";

function getQueue(): QueuedRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function enqueue(
  request: Omit<QueuedRequest, "id" | "createdAt" | "retries">
): void {
  const queue = getQueue();
  queue.push({
    ...request,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    retries: 0,
  });
  saveQueue(queue);
}

export async function flushQueue(): Promise<{
  succeeded: number;
  failed: number;
}> {
  const queue = getQueue();
  if (queue.length === 0) return { succeeded: 0, failed: 0 };

  let succeeded = 0;
  let failed = 0;
  const remaining: QueuedRequest[] = [];

  for (const item of queue) {
    try {
      const res = await fetch(item.endpoint, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.body),
      });
      if (res.ok) {
        succeeded++;
      } else {
        failed++;
        remaining.push({ ...item, retries: item.retries + 1 });
      }
    } catch {
      failed++;
      remaining.push({ ...item, retries: item.retries + 1 });
    }
  }

  saveQueue(remaining);
  return { succeeded, failed };
}

export function getQueueLength(): number {
  return getQueue().length;
}
