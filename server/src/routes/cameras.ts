import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import type { Camera } from "shared";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

let cachedCameras: Camera[] | null = null;

export function detectLocalCameras(): Camera[] {
  const v4lPath = "/sys/class/video4linux";
  try {
    if (!fs.existsSync(v4lPath)) {
      return [];
    }

    const devices = fs.readdirSync(v4lPath).filter((d) => d.startsWith("video"));
    const seenNames = new Set<string>();
    const cameras: Camera[] = [];
    let slot = 1;

    for (const device of devices) {
      const namePath = path.join(v4lPath, device, "name");
      try {
        const name = fs.readFileSync(namePath, "utf-8").trim();
        if (seenNames.has(name)) continue;
        seenNames.add(name);

        cameras.push({
          id: uuidv4(),
          name,
          slot: slot++,
          status: "online",
          streamUrl: `http://localhost:8080/stream/${device}`,
        });
      } catch {
        // Skip devices we can't read
      }
    }

    return cameras;
  } catch {
    return [];
  }
}

// GET /api/cameras
router.get("/", authMiddleware, (_req: Request, res: Response) => {
  if (!cachedCameras) {
    cachedCameras = detectLocalCameras();
  }
  res.json(cachedCameras);
});

// POST /api/cameras/refresh
router.post("/refresh", authMiddleware, (_req: Request, res: Response) => {
  cachedCameras = detectLocalCameras();
  res.json(cachedCameras);
});

export { router as camerasRouter };
