import { useState } from "react";
import GameGrid from "../components/GameGrid";
import Pagination from "../components/Pagination";
import "../App.css";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { GameAPIResponse } from "../api/Games";
import { getGames } from "../api/Games";

const PAGE_SIZE = 10;

function GameBrowsingPage() {
    const [page, setPage] = useState(1);

    const queryOptions: UseQueryOptions<GameAPIResponse, Error, GameAPIResponse, [string, number]> = {
        queryKey: ["games", page],
        queryFn: () => getGames(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    };

    const { data, isLoading, error } = useQuery(queryOptions);

    if (isLoading) return <p>Loading games...</p>;
    if (error) return <p>Error loading games: {error.message}</p>;

    const games = data?.results || [];
    const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

    return (
        <>
            <Header />
            <main>
                <GameGrid games={games} />
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </main>
            <footer>
                <p>&copy; 2025 MyWebsite. All rights reserved.</p>
            </footer>
        </>
    );
}

export default GameBrowsingPage;
