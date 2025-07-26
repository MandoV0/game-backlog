import GameCard from "./GameCard";

export const GameGrid = ({ games, isReviewCard }) => {
  
  return(
    <div  className="game-grid-container">
      <div className="game-grid">
        {
          games.map((game) => (
            <GameCard
              key={game.gameid}
              id={game.gameid}
              image={'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
              name={game.title}
              description={game.description}
              genres={game.genres.map((genre) => genre)}
              isReviewCard={isReviewCard}
            />
          ))
        }
      </div>
    </div>);
}