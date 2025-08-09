import React from 'react';
import '../styles/Games.css';
import { Review } from '../components/Review';

export const Games = () => {
    return (
    <div className="games-container">
      <div className="left-div">
        <img src="https://placehold.co/400x700" alt="Game Image" className="game-image" />
        <Review/>
        </div>
      <div className="right-div">
        <div className="game-info-container">
          <h1>Game Title</h1>
          <p>Release Info</p>
          <p>Game Description Game Description Game Description Game Description Game Description </p>
          <span>Genres</span>
        </div>
      </div>
    </div>
    );
};