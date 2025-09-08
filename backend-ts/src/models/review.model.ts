export interface Review {
    id: number;
    game_id: number;
    user_id: number;
    rating: number;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}

export interface RatingStatistics {
    total_reviews: number;
    average_rating: number | null;
    ten_star_reviews: number;
    nine_star_reviews: number;
    eight_star_reviews: number;
    seven_star_reviews: number;
    six_star_reviews: number;
    five_star_reviews: number;
    four_star_reviews: number;
    three_star_reviews: number;
    two_star_reviews: number;
    one_star_reviews: number;
    zero_star_reviews: number;
}

export interface UserGameReviews {
    game_id: number;
    user_id: number;
    title: string;
    content: string;
    rating: number;
    game_title: string;
}

export interface GameStatusStatistics {
    playing: number;
    completed: number;
    backlog: number;
    dropped: number;
}