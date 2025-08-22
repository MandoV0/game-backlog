export interface Review {
  reviewid: string;
  gameid: string;
  userid: string;
  rating: number;
  review_text: string;
  review_date: Date;
}

export interface RatingSummary {
  gameid: string;
  average_rating: number;
  one_star_reviews: number;
  two_star_reviews: number;
  three_star_reviews: number;
  four_star_reviews: number;
  five_star_reviews: number;
  total_reviews: number;
}