import { useState, useEffect } from "react";
import { GameService } from "../services/GameService";

export interface GameReview {
  reviewid: number;
  gameid: number;
  rating: number;
  review_text: string;
  review_date: string;
  userid: number;
  username: string;
}

export function useGameReviews(gameid: string | undefined) {
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!gameid) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await GameService.getGameReviews(gameid);
      console.log("Fetched review data in useGameReviews:", data.results);
      setReviews(data.results);
    } catch (err: any) {
      setError(err.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [gameid]);

  return { reviews, loading, error, refetch: fetchReviews };
}
