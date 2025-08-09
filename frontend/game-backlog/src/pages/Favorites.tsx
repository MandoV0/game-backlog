import React, { useState, useEffect } from "react";
import { GameContainer } from "../components/GameContainer";
import { Game } from "./Home";
import { fetchData, fetchFavorites } from "../helpers/fetchGame";
import Pagination from "../components/Pagination";

const pageSize: number = 20;

export const Favorites: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites(
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
    <GameContainer games={games}/>
    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
  </div>);
};