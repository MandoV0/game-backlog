import React, { useState } from 'react';
import '../styles/Cards.css'
import { GameService } from '../services/GameService';
import { Link } from 'react-router-dom';

export interface GameCardProps {
  gameid: number;
  title: string;
  description: string;
  genres: string[];
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
  
  return (
    <div className='game-card'>
      <div className='image-container'>
        <Link to={`/games/${gameid}`}>
          { imageUrl ? ( <img src={imageUrl}/> ) : ( <span>Image</span> ) }
        </Link>
        <button onClick={() => {setFavorite(!favorite); GameService.toggleFavorite(gameid)} } className='favorite-btn'>{favorite ? '★' : '☆'}</button>
      </div>

        <h3>
          <Link to={`/games/${gameid}`}>{title}</Link>
        </h3>
        <p>{description}</p>

      <div>{genres.map((genre, index) => (
        <span className='genre-text' key={index}>{genre}</span>
      ))}
      </div>
    </div>
  )
}