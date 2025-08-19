import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/error";

export function errorHandler(err: Error | ApiError, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
}
