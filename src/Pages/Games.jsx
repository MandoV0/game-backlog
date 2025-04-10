import Pagination from "../Components/Pagination";
import { Header } from "../Components/Header";
import { Search } from "../Components/Search";
import { GameGrid } from "../Components/GameGrid";
import React, {useState, useEffect} from "react";
import { getGames } from "../Services/API";
import { Navbar } from "../Components/Navbar";
import "../Styles/Game.css";

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const data = await getGames(currentPage, 20);
        setGames(data.results);
        const totalPages = Math.ceil(data.count / 20);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
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
    <div className="games-container">
      <Navbar/>
      <Search></Search>

      {loading ? ( <p>Loading Games...</p>) : (<GameGrid games={games} />)}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      </div>
  );
}

export default Games;