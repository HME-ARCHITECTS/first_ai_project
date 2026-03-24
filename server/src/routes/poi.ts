import { Router, Request, Response } from "express";
import { AddPoiRequestSchema, type PointOfInterest } from "shared";
import { ZodError } from "zod";

const router = Router();

// In-memory store (will be replaced per spec in future iterations)
const pois: PointOfInterest[] = [];

// POST /api/pois — Add a Point of Interest
router.post("/", (req: Request, res: Response) => {
  try {
    const poi = AddPoiRequestSchema.parse(req.body);
    pois.push(poi);
    res.status(201).json(poi);
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: err.errors.map((e) => e.message).join(", "),
        statusCode: 400,
      });
      return;
    }
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
});

// GET /api/pois — List all POIs
router.get("/", (_req: Request, res: Response) => {
  res.json(pois);
});

export { router as poiRouter };
