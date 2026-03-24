import { Router, Request, Response } from "express";
import { CreateSessionRequestSchema, type StoreSession } from "shared";
import { ZodError } from "zod";

const router = Router();

// In-memory store (will be replaced per spec in future iterations)
const sessions: StoreSession[] = [];

// POST /api/sessions — Create a new store session
router.post("/", (req: Request, res: Response) => {
  try {
    const session = CreateSessionRequestSchema.parse(req.body);
    sessions.push(session);
    res.status(201).json(session);
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

// GET /api/sessions — List all sessions
router.get("/", (_req: Request, res: Response) => {
  res.json(sessions);
});

export { router as sessionRouter };
