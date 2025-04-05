import React, { useState, useEffect } from 'react';

const GameCard = ({ id, image, name, description, genres }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Helper function to get a cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Toggle favorite status and update the cookie
  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Update the cookie
    const favorites = JSON.parse(getCookie('favorites') || '{}');
    favorites[id] = newFavoriteStatus;
    document.cookie = `favorites=${JSON.stringify(favorites)}; path=/; max-age=31536000`; // 1 year
  };

  // Load favorite status from the cookie on component mount
  useEffect(() => {
    const favorites = JSON.parse(getCookie('favorites') || '{}');
    if (favorites[id]) {
      setIsFavorite(true);
    }
  }, [id]);

  return (
    <div className="gamecard">
      <button
        className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
        onClick={toggleFavorite}
        aria-label="Favorite"
      >
        ★
      </button>
      <img src={image} alt={name} />
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