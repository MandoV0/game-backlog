import React, { useState, useEffect } from 'react';
import { deleteFavorite, saveFavorite, isFavorite } from '../Utils/Cookies';
import '../Styles/Game.css';
import ProgressDropdown from '../Components/ProgressDropdown'; 
import RatingBar from '../Components/RatingBar'; // Import the RatingBar component

const GameCard = ({ id, image, name, description, genres, isReviewCard }) => {
  const [isFav, setIsFavorite] = useState(false);
  console.log(document.cookie);
  // Toggle favorite status and update the cookie
  const toggleFavorite = () => {
    setIsFavorite(!isFav); // Toggle the state
    if (isFav) {
      deleteFavorite(id); // Remove from favorites
    }
    else {
      saveFavorite(id); // Add to favorites
    }
  };

  // Load favorite status from the cookie on component mount
  useEffect(() => {
    setIsFavorite(isFavorite(id)); // Check if the current ID is in the favorites
  }, [id]);

  return (
     // Double click to favorite
    <div className="gamecard" onClick={e => { if (e.detail === 2) { toggleFavorite(); } }}>
      <button
        className={`favorite-button ${isFav ? 'favorite' : ''}`}
        onClick={toggleFavorite}
        aria-label="Favorite"
      >
        ★
      </button>
      <img src={image} alt={name} />
      <h2>{name}</h2>

      {isReviewCard // Only show the ratings and progress dropdown if this is in the backlog panel
        ?
        <>
          <ProgressDropdown progress={0} onChange={() => {}} />
          <RatingBar/> 
        </>
        : null
      }
      
      <div className="genres-container">
        {genres.length > 0 ? genres.map((genre, index) => (
          <span key={index} className="genrecard">{genre}</span>
        )) : <span className="genrecard">No genres available</span>}
      </div>
    </div>
  );
};

export default GameCard;