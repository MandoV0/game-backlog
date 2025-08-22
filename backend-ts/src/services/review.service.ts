import * as reviewRepo from "../repositories/review.repository";
import { ApiError } from "../utils/error";
import { Review } from "../models/review.model";

export async function createReview(gameId: number, userId: number, rating: number, review_text: string): Promise<Review> {
  const result = await reviewRepo.createReview(gameId, userId, rating, review_text);
  if (!result) throw new ApiError(500, "Failed to create review");
  return result;
}

export async function deleteReview(gameId: number, userId: number): Promise<Review> {
  const result = await reviewRepo.deleteReview(gameId, userId);
  if (!result) throw new ApiError(500, "Failed to delete review");
  return result;
}

export async function getReviews(gameId: number, limit: number = 10, offset: number = 0): Promise<Review[]> {
  const result = await reviewRepo.getReviews(gameId, limit, offset);
  if (!result) throw new ApiError(500, "Failed to get reviews");
  return result;
}

export async function getRatingSummary(gameId: number) {
  const result = await reviewRepo.getRatingSummary(gameId);
  if (!result) throw new ApiError(404, "Game with ID " + gameId + " not found");
  return result;
}