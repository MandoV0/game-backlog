import React, { useState } from 'react';
import '../styles/GameCard.css'

interface GameCardProps {
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
        { imageUrl ? ( <img src={imageUrl}/> ) : ( <span>Image</span> ) }
        <button onClick={() => setFavorite(!favorite)} className='favorite-btn'>{favorite ? '★' : '☆'}</button>
      </div>

        <h3>{title}</h3>
        <p>{description}</p>

      <div>{genres.map((genre, index) => (
        <span className='genre-text' key={index}>{genre}</span>
      ))}
      </div>
    </div>
  )
}