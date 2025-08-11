import { useState, useEffect } from "react";
import { mapGame } from "../services/GameMapper";
import { getGameById } from "../services/API";

export function useGame(gameid: string | undefined) {
  const [game, setGame] = useState<ReturnType<typeof mapGame> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameid) {
      setGame(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchGame = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getGameById(gameid);

        setGame(mapGame(data));
      } catch {
        setError("Failed to load game.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameid]);

  return { game, loading, error };
}
