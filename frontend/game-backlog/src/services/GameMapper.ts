export const mapGame = (game: any) => ({
  gameid: game.gameid,
  title: game.title,
  description: game.description,
  genres: game.genres,
  images: game.images,
  isFavorite: game.is_favorite
});