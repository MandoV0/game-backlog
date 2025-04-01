import './App.css';
import GameCard from './GameCard';
import gamesData from './mockadata.json';
import { useEffect, useState } from 'react';

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
      <div className='searchContainer'>
        <input type='text' placeholder='Search Games...' className='searchInput'>
        </input>
      </div>
      <div className='game-grid'>
        {loading ? (
          <p>Loading games...</p>
        ) : games.length > 0 ? games.map((game) =>
          <GameCard
            key={game.id} // Add a key prop for performance
            image={game.background_image}
            name={(game.name)}
            description={"Placeholder"}
            genres={game.genres.map(genre => genre.name)}
          />
        ) : <p>No games found</p>}
      </div>
      <div className='pagination-container'>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Calculate which page numbers to show
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else {
            // To have the current page in center when we have 2 pages to the left and right.
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + 4);
            start = Math.max(1, end - 4);
            pageNum = start + i;
          }
          
          return (
            <button 
              key={pageNum}
              className={`page-button ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

async function getGames(page, pageSize) {
  const apiKey = process.env.REACT_APP_API_KEY;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;
  console.log("URL: " + url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    
    return data;
  } catch (error) {
    console.error(error.message);
    return { results: [], count: 0 };
  }
}

//getGames();

export default App;
