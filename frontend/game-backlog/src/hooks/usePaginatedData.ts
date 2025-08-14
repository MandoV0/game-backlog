import { useState, useEffect } from "react";
import { fetchPaginatedData } from "../services/PaginatedFetcher";

export function usePaginatedData(
  fetchFunc: (offset: number, limit: number) => Promise<any>,
  initialPage: number = 1,
  pageSize: number = 20
) {
  const [games, setGames] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const { games, totalPages } = await fetchPaginatedData(
          fetchFunc,
          page,
          pageSize
        );
        setGames(games);
        setTotalPages(totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, pageSize, fetchFunc]);

  return { games, totalPages, page, setPage, loading, error };
}