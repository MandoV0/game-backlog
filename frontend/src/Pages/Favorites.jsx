import React, { useEffect } from "react";
import { useState } from "react";
import "../Styles/Favorites.css";
import { GameGrid } from "../Components/GameGrid";
import { bulkFetchGames } from "../Services/API";
import { getFavorites } from "../Utils/Cookies";
import Pagination from "../Components/Pagination";
import { Navbar } from "../Components/Navbar";

const Favorites = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        setLoading(true);

        const allFavorites = getFavorites().filter(id => typeof id === 'number' && !isNaN(id));
        const data = await bulkFetchGames(allFavorites);
        const games = data.results || [];
        const startIndex = (currentPage - 1) * 20;
        const endIndex = startIndex + 20;
        
        setGames(games.slice(startIndex, endIndex));

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

  const validGames = games.filter(game => game !== null && game !== undefined);

  return (
    <div>
      <Navbar/>
      <h1 className="h1">Your Favorite Games</h1>
      {loading ? (<p>Loading games...</p>) : <GameGrid games={games} isReviewCard={true} />}
      { getFavorites().length > 20 ?
      (<Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(validGames.length / 20)}
        onPageChange={handlePageChange}
      />) : null}
    </div>
  );
};

export default Favorites;