import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToBacklog, updateBacklogStatus, removeFromBacklog } from "../api/Games";
import { isGameInBacklog } from "../api/Client";
import type { BacklogStatusData } from "../api/Client";
import "../styles/GameDetails.css";

interface BacklogStatusProps {
    gameId: number;
}

const displayMap: Record<string, string> = {
    backlog: "Wishlist",
    playing: "Playing",
    completed: "Completed",
    dropped: "Dropped",
};

const apiMap: Record<string, string> = {
    Wishlist: "backlog",
    Playing: "playing",
    Completed: "completed",
    Dropped: "dropped",
};

export const BacklogStatusComponent: React.FC<BacklogStatusProps> = ({ gameId }) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<BacklogStatusData, Error>({
        queryKey: ["backlogStatus", gameId],
        queryFn: async () => {
            const res = await isGameInBacklog(gameId);
            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (action: string) => {
            if (action === "add") return addToBacklog(gameId);
            if (action === "remove") return removeFromBacklog(gameId);
            return updateBacklogStatus(gameId, apiMap[action]);
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["backlogStatus", gameId] }),
        onError: (err) => console.error("Backlog update failed:", err),
    });

    const handleChange = (value: string) => {
        if (value === "add-to-backlog") mutation.mutate("add");
        else if (value === "remove-from-backlog") mutation.mutate("remove");
        else mutation.mutate(value);
    };

    if (isLoading) {
        return (
            <div className="backlog-container">
                <h2>Backlog</h2>
                <p>Loading backlog status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="backlog-container">
                <h2>Backlog</h2>
                <p className="backlog-error">Error: {error.message}</p>
            </div>
        );
    }

    const currentStatus = data?.inBacklog
        ? displayMap[data.status || "backlog"] || "Wishlist"
        : "not-in-backlog";

    return (
        <div className="backlog-container">
            <h2>Backlog</h2>

            {!data?.inBacklog ? (
                <button
                    onClick={() => handleChange("add-to-backlog")}
                    disabled={mutation.isPending}
                >
                    ➕
                </button>
            ) : (
                <select
                    value={currentStatus}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={mutation.isPending}
                >
                    <option value="Wishlist">📅 Wishlist</option>
                    <option value="Playing">🎮 Playing</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="Dropped">❌ Dropped</option>
                    <option value="remove-from-backlog">🗑️ Remove</option>
                </select>
            )}

            <p className="backlog-status">
                Status: {data?.inBacklog ? currentStatus : "Not in backlog"}
            </p>

            {mutation.isPending && <p className="backlog-loading">Updating...</p>}
            {mutation.isError && <p className="backlog-error">Error updating backlog</p>}
        </div>
    );
};

export default BacklogStatusComponent;
