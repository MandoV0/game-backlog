import React, { useEffect, useState } from 'react';
import '../styles/Home.css'
import { GameCard } from './GameCard'
import { getGames } from '../services/API';
import Pagination from '../components/Pagination';

type Game = {
  id: number;
  title: string;
  description: string;
  genres: string[];
  images: string[];
  isFavorite?: boolean;
}

const pageSize: number = 20

export const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalpages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGames();
        const mappedGames = data.results.map((game: any) => ({
          id: game.gameid,
          title: game.title,
          description: game.description,
          genres: game.genres,
          images: game.images,
        }));
        setTotalpages(Number(Math.ceil(parseInt(data.count) / pageSize)))
        setGames(mappedGames);
      } catch (err: any) {
        setError(err.message || 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return(
  <div>
    Text wow
    <div className='gamecard-grid'>
      {games.map((game, index) => (
        <GameCard title={game.title} description={game.description} genres={game.genres} imageUrl={game.images[0]} key={index}/>
      ))}
    </div>
    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
  </div>
);
};