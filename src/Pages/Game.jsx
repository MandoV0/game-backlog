import "../Styles/Games.css";
import React from "react";

const Game = ({ game }) => {
    return(
        <div className="game-container">
            <div className="left-panel">
                <img className="game-image" src="https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png"></img>
            </div>
            <div className="right-panel">
                <h1 className="game-header">The Elder Scrolls V Skyrim</h1>
            </div>
        </div>
    ); 
}
export default Game;

