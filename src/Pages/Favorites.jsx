import React, { useEffect } from "react";
import { useState } from "react";
import "../Styles/Favorites.css";
import { Header } from "../Components/Header";
import { GameCard } from "../Components/GameCard";
import { GameGrid } from "../Components/GameGrid";
import { bulkFetchGames, getGames } from "../Services/API";
import { getFavorites } from "../Utils/Cookies";
import Pagination from "../Components/Pagination";

const Favorites = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        setLoading(true);
        const startIndex = (currentPage - 1) * 20;
        const endIndex = startIndex + 20;
        const newIndexes = getFavorites().slice(startIndex, endIndex);
        
        const data = await bulkFetchGames(newIndexes);

        if (data && data.results) {
          console.log("Game Data: ", data.results);
          setGames(data.results);
        } else {
          console.error("Invalid Data.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }
  , [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <Header></Header>
      <h1 className="h1">Your Favorite Games</h1>
      {loading ? (<p>Loading games...</p>) : <GameGrid games={games} />}
      { getFavorites().length > 20 ?
      (<Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(getFavorites().length / 20)}
        onPageChange={handlePageChange}
      />) : null}
    </div>
  );
};

export default Favorites;