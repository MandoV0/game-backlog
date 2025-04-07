import GameCard from "./GameCard";

export const GameGrid = ({ games }) => {
  
  return(<div className="game-grid">
    {
      games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          image={game.background_image}
          name={game.name}
          description={"Placeholder"}
          genres={game.genres.map((genre) => genre.name)}
        />
      ))
    }
  </div>);
}