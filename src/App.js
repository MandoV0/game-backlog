import "./App.css";
import GameCard from "./GameCard";
import Pagination from "./Pagination";
import gamesData from "./mockadata.json";
import { useEffect, useState } from "react";
import { getGames } from "./API";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGames(currentPage, 20);
        setGames(data.results);
        const totalPages = Math.ceil(data.count / 20);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); // call when currentPage changes

  // Reset the page to the top when the page changes
  const handlePageChange = (page) => {
    console.log(`Changing to page: ${page}`);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search Games..."
          className="searchInput"
        ></input>
      </div>
      <div className="game-grid">
        {loading ? (
          <p>Loading games...</p>
        ) : games.length > 0 ? (
          games.map((game) => (
            <GameCard
              id={game.id}
              image={game.background_image}
              name={game.name}
              description={"Placeholder"}
              genres={game.genres.map((genre) => genre.name)}
            />
          ))
        ) : (
          <p>No games found</p>
        )}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      </div>
  );
}

export default App;