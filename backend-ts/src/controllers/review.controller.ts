import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/review.service";

export async function createReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, rating, review_text } = req.body;
    const userId = req.user?.id;
    
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newReview = await reviewService.createReview(gameId, userId, rating, review_text);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
}

export async function deleteReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = Number(req.params.gameId);
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!gameId) return res.status(400).json({ message: "Invalid game ID" });

    await reviewService.deleteReview(gameId, userId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function getReviewsController(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = Number(req.params.gameId);
    const reviews = await reviewService.getReviews(gameId, 10, 0);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function getRatingSummaryController(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = Number(req.params.gameId);
    const summary = await reviewService.getRatingSummary(gameId);
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
}