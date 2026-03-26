import { Router, Request, Response } from "express";
import { ImageCaptureSchema, type ImageCapture } from "shared";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const captures: ImageCapture[] = [];

// POST /api/captures — Save a camera feed capture (auth required)
router.post("/", authMiddleware, (req: Request, res: Response) => {
  const result = ImageCaptureSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: result.error.errors.map((e) => e.message).join(", "),
      statusCode: 400,
    });
    return;
  }

  captures.push(result.data);
  res.status(201).json(result.data);
});

export { router as capturesRouter };
