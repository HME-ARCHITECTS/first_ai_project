import { Request, Response, NextFunction } from "express";

// In-memory token store (shared with auth route)
export const validTokens = new Map<string, { installerId: string; expiresAt: string }>();

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Missing or invalid authorization header",
      statusCode: 401,
    });
    return;
  }

  const token = authHeader.slice(7);
  const session = validTokens.get(token);

  if (!session) {
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid or expired token",
      statusCode: 401,
    });
    return;
  }

  if (new Date(session.expiresAt) < new Date()) {
    validTokens.delete(token);
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Token has expired",
      statusCode: 401,
    });
    return;
  }

  next();
}
