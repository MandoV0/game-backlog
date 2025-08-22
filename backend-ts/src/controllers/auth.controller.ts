import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { ApiError } from "../utils/error";

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, username } = req.body;
    const user = await authService.registerUser(username, email, password);
    res.json(user);
  } catch (error) {
    next(error);
  }
}
