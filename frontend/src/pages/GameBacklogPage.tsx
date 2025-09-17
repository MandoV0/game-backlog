import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import React from "react";
import { getUserBacklog, type GameBacklogData, type GameBacklogResponse } from "../api/Games";
import "../styles/Game.css";
import Header from "../components/Header";

export const GameBacklogPage = () => {
    const { data, isLoading, error } = useQuery<GameBacklogData[], Error>({
        queryKey: ["userBacklog"],
        queryFn: async() => {
            const res = await getUserBacklog();
            return res.data;
        },
    });

    if (isLoading) return <p>Loading backlog...</p>;
    if (error) return <p>An error has occured: {error.message}</p>;

    return (
        <>
            <Header></Header>
            <ul className="game-list">
                {data?.map((game) => (
                    <li key={game.game_id} className="game-card-hor">
                        <h3>{game.title} </h3>
                        <p>Status: {game.status}</p>
                    </li>
                ))}
            </ul>
        </>
    );
};
