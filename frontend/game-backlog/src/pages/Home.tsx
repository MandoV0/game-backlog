import React, { useEffect, useState } from "react";
import "../styles/Layout.css";
import Pagination from "../components/Pagination";
import { GameContainer } from "../components/GameContainer";
import { usePaginatedGames } from "../hooks/usePaginatedGames";

export type Game = {
  gameid: string;
  title: string;
  description: string;
  genres?: { genreid: number; name: string }[];
  images: { imageid: number; url: string }[];
  isFavorite?: boolean;
};

const pageSize: number = 20;

export const Home: React.FC = () => {
  const { games, totalPages, page, setPage, loading, error } = usePaginatedGames(20);

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
