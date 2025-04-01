import React from 'react';

const GameCard = ({ image, name, description, genres }) => {
  return (
    <div className='gamecard'>
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