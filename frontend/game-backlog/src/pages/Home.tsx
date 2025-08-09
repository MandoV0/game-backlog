import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { GameCard } from "../components/GameCard";
import { getGames } from "../services/API";
import Pagination from "../components/Pagination";
import { fetchData } from "../helpers/fetchGame";
import { GameContainer } from "../components/GameContainer";

export type Game = {
  gameid: number;
  title: string;
  description: string;
  genres: string[];
  images: string[];
  isFavorite?: boolean;
};

const pageSize: number = 20;

export const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchData(
      currentPage,
      pageSize,
      setGames,
      setTotalpages,
      setError,
      setLoading
    );
  }, [currentPage]);

  return (
    <div>
      Text wow
      <GameContainer games={games} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
