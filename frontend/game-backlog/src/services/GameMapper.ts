export const mapGame = (game: any) => ({
  gameid: game.gameid,
  title: game.title,
  description: game.description,
  genres: game.genres,
  images: game.images,
  isFavorite: game.is_favorite
});

export const mapReview = (review: any) => ({
  totalReviews: review.total_reviews,
  oneStarReviews: review.one_star,
  twoStarReviews: review.two_star,
  threeStarReviews: review.three_star,
  fourStarReviews: review.four_star,
  fiveStarReviews: review.five_star,
  avgReview: review.avg_review
});