import React, { useState, useEffect } from "react";
import { GameContainer } from "../components/GameContainer";
import Pagination from "../components/Pagination";
import { usePaginatedFavorites } from "../hooks/usePaginatedGames";

const pageSize: number = 20;

export const Favorites: React.FC = () => {
  const { games, totalPages, page, setPage, loading, error } =
    usePaginatedFavorites(20);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <GameContainer games={games} />
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};
