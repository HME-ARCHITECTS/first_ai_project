import { Router, Request, Response } from "express";
import { LoginCredentialsSchema } from "shared";
import { v4 as uuidv4 } from "uuid";
import { validTokens } from "../middleware/authMiddleware";

const router = Router();

const DEFAULT_PASSWORD = "VisionAI-Install-2026";

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  const result = LoginCredentialsSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: result.error.errors.map((e) => e.message).join(", "),
      statusCode: 400,
    });
    return;
  }

  const { installerId, password } = result.data;

  if (password !== DEFAULT_PASSWORD) {
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid installer ID or password",
      statusCode: 401,
    });
    return;
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  validTokens.set(token, { installerId, expiresAt });

  res.json({
    token,
    installerId,
    deviceId: `device-${uuidv4().slice(0, 8)}`,
    expiresAt,
  });
});

export { router as authRouter };
