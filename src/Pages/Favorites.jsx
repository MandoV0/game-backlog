import React, { useEffect } from "react";
import { useState } from "react";
import "../Styles/Favorites.css";
import { Header } from "../Components/Header";
import { GameCard } from "../Components/GameCard";
import { GameGrid } from "../Components/GameGrid";
import { getGames } from "../Services/API";

const Favorites = () => {

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getGames(1, 20);
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
  }
  , []);

  return (
    <div>
      <Header></Header>
      <h1 className="h1">Your Favorite Games</h1>
      {loading ? (<p>Loading games...</p>) : (<GameGrid games={games} />)}
    </div>
  );
};

export default Favorites;