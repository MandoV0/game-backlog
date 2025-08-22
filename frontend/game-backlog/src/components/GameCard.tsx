import React, { useState } from 'react';
import '../styles/Cards.css'
import { GameService } from '../services/GameService';
import { Link } from 'react-router-dom';

export interface GameCardProps {
  gameid: string;
  title: string;
  description: string;
  genres?: { genreid: number; name: string }[];
  imageUrl?: string;
  isFavorite?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  gameid,
  title,
  description,
  genres,
  imageUrl,
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async () => {
    if (favLoading) return;
    setFavLoading(true);

    try {
      await GameService.createFavorite(gameid);
      setFavorite(true);
    } catch (error: any) {
      if (error?.response?.status === 400) {
        console.warn("Game is already a favorite");
      } else {
        console.error("Error creating favorite:", error);
      }
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className='game-card'>
      <div className='image-container'>
        <Link to={`/games/${gameid}`}>
          { imageUrl ? <img src={imageUrl} alt={title}/> : <span>Image</span> }
        </Link>
        <button 
          onClick={handleFavoriteClick} 
          className='favorite-btn'
          disabled={favLoading}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>

      <h3>
        <Link to={`/games/${gameid}`}>{title}</Link>
      </h3>
      <p>{description}</p>

      <div>
        {genres?.map((genre) => (
          <span className='genre-text' key={genre.genreid}>{genre.name}</span>
        ))}
      </div>
    </div>
  );
}
