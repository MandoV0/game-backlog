import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/error";


const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new ApiError(401, "Unauthorized"));

  const token = authHeader.split(" ")[1];
  if (!token) return next(new ApiError(401, "Unauthorized"));

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    req.user = payload;
    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized"));
  }
}