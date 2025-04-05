import React, { useEffect, useState } from 'react';

const GameCard = ({ id, image, name, description, genres, }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Toggle favorite status and update the cookie
  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update the cookie
    const favorites = JSON.parse(getCookie('favorites') || '{}');
    favorites[id] = newFavoriteStatus;
    document.cookie = `favorites=${JSON.stringify(favorites)}; path=/; max-age=31536000`;
  };

  useEffect(() => {
    // Check if the game is already a favorite when the component loads
    const favorites = JSON.parse(getCookie('favorites') || '{}');
    setIsFavorite(favorites[id] || false);
  }, [id]);

  return (
    <div className='gamecard'>
        <button
          className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
          onClick={toggleFavorite}
        > ★ </button>
        <img src={image}/>
        <h2>{name}</h2>
        <div className="genres-container">
        {genres.map((genre, index) => (
          <span key={index} className="genrecard">{genre}</span>
        ))}
      </div>
    </div>
  );
};

export default GameCard;