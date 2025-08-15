import { GameService } from "../services/GameService";

export function useReviewAction(gameid?: string, refreshReviews?: () => void) {
  const submitReview = async (rating: number, reviewText: string) => {
    if (!gameid) throw new Error("[useReviewAction] Missing game ID");
    await GameService.postReview(gameid, rating, reviewText);
    refreshReviews?.(); /* Optional Callback */
  };

  return { submitReview };
}