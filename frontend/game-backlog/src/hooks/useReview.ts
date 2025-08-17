import { useState, useEffect } from "react";
import { mapReview } from "../services/GameMapper";
import { GameService } from "../services/GameService";

export function useReview(gameid: string | undefined) {
  const [review, setReview] = useState<ReturnType<typeof mapReview> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameid) {
      setReview(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchReviewStats = async () => {
      try {
        const data = await GameService.getReviewStats(gameid);
        setReview(mapReview(data));
      } catch (err) {
        console.error("Failed to load review stats:", err);
        setError("Failed to load review statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, [gameid]);

  return { review, loading, error };
}
