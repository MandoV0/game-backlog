import React from 'react'
import '../styles/GameDetails.css'
import type { GameReviewStatsData } from '../api/Games'

interface GameRatingContainerProps {
    data: GameReviewStatsData | undefined;
}

export const GameRatingContainer: React.FC<GameRatingContainerProps> = ({ data }) => {
    if (!data) return <p>Ratings are empty</p>; 
    const average: number = Number(data?.average_rating) || 0;

    const stars = [
        { label: 10, count: data.ten_star_reviews },
        { label: 9, count: data.nine_star_reviews },
        { label: 8, count: data.eight_star_reviews },
        { label: 7, count: data.seven_star_reviews },
        { label: 6, count: data.six_star_reviews },
        { label: 5, count: data.five_star_reviews },
        { label: 4, count: data.four_star_reviews },
        { label: 3, count: data.three_star_reviews },
        { label: 2, count: data.two_star_reviews },
        { label: 1, count: data.one_star_reviews },
        { label: 0, count: data.zero_star_reviews }
    ];

    return (
        <div className='game-rating-container'>
            <h1>Ratings</h1>
            {stars
                .filter(r => r.count > 0)
                .map(r => {
                    const filled = '★'.repeat(r.label);
                    const empty = '☆'.repeat(Math.max(0, 10 - r.label));
                    return <span key={r.label} className='star'>{filled + empty} {r.count}</span>
                })
            }
            <p>
                Average Rating: {Number(average.toFixed(2) ?? 0)} ({data.total_reviews ?? 0} Reviews)
            </p>
        </div>
    )
}