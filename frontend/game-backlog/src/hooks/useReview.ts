import { useState, useEffect } from "react";
import { mapReview } from "../services/GameMapper";
import { getReviewsByGameId } from "../services/API";

export function useReview(gameid: string | undefined) {
  const [review, setReview] = useState<ReturnType<typeof mapReview> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameid) {
      setReview(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchGame = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReviewsByGameId(gameid);

        setReview(mapReview(data));
      } catch {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameid]);

  return { review, loading, error };
}
