import { Router, Request, Response } from "express";
import { SiteSurveySchema } from "shared";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// In-memory store
const surveys: Map<string, Record<string, unknown>> = new Map();

const STEP_LABELS = ["Store Info", "Hardware", "Network", "Cameras", "Review"];

// POST /api/surveys — submit a completed survey
router.post("/", authMiddleware, (req: Request, res: Response) => {
  const result = SiteSurveySchema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors = result.error.issues.map((issue) => {
      const path = issue.path;
      // Map top-level fields to step numbers
      let step = 4;
      let stepLabel = STEP_LABELS[4];
      const topField = String(path[0]);
      if (topField === "storeInfo") { step = 0; stepLabel = STEP_LABELS[0]; }
      else if (topField === "hardware") { step = 1; stepLabel = STEP_LABELS[1]; }
      else if (topField === "network") { step = 2; stepLabel = STEP_LABELS[2]; }
      else if (topField === "camerasPlacements") { step = 3; stepLabel = STEP_LABELS[3]; }

      return {
        step,
        stepLabel,
        field: path.length > 1 ? String(path[path.length - 1]) : topField,
        message: issue.message,
      };
    });

    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Survey is missing required fields",
      statusCode: 400,
      fieldErrors,
    });
    return;
  }

  const survey = { ...result.data, status: "submitted" as const, submittedAt: new Date().toISOString() };
  surveys.set(survey.id, survey as unknown as Record<string, unknown>);
  res.status(201).json(survey);
});

// PUT /api/surveys/:id — save a draft (partial data)
router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  const id = String(req.params.id);
  const existing = surveys.get(id);
  const draft = {
    ...(existing ?? {}),
    ...req.body,
    id,
    status: "draft",
    updatedAt: new Date().toISOString(),
  };
  surveys.set(String(id), draft);
  res.json(draft);
});

// GET /api/surveys — list all surveys
router.get("/", authMiddleware, (_req: Request, res: Response) => {
  res.json(Array.from(surveys.values()));
});

// GET /api/surveys/:id — get single survey
router.get("/:id", authMiddleware, (req: Request, res: Response) => {
  const survey = surveys.get(String(req.params.id));
  if (!survey) {
    res.status(404).json({
      error: "NOT_FOUND",
      message: "Survey not found",
      statusCode: 404,
    });
    return;
  }
  res.json(survey);
});

export { router as surveysRouter, surveys as surveyStore };
