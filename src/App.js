import './App.css';
import GameCard from './GameCard';
import gamesData from './mockadata.json';
import { useEffect, useState } from 'react';

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const data = gamesData.results;
    setGames(data);
  }, []);

  return (
    <div>
      <div className='searchContainer'>
        <input type='text' placeholder='Search Games...' className='searchInput'>
        </input>
      </div>
      <div className='game-grid'>
        {games.map((game) =>
          <GameCard
            image={game.background_image}
            name={(game.name)}
            description={"Placeholder"}
            genres={game.genres.map(genre => genre.name)}
          />
        )}
      </div>
      <div className='pagination-container'>
          <button className='page-button'>1</button>
          <button className='page-button'>2</button>
          <button className='page-button'>3</button>
          <button className='page-button'>4</button>
          <button className='page-button'>5</button>
      </div>
    </div>
  );
}

async function getGames(page, pageSize) {
  const apiKey = `ecf5db96534148848a0a970a030896a7`;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;
  console.log("URL: " + url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

//getGames();

export default App;
