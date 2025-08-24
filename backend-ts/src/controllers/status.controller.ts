import { Request, Response, NextFunction } from "express";
import * as statusService from "../services/status.service";
import { ApiError } from "../utils/error";

export async function getStatuses(req: Request, res: Response, next: NextFunction) {
  try {
    const statuses = await statusService.getStatuses();
    res.json(statuses);
  } catch (error) {
    next(error);
  }
}