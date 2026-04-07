export type GameStatus = "DRAFT" | "UPLOADING" | "PROCESSING" | "PUBLISHED" | "FAILED";

export interface Game {
    id: number;
    name: string;
    description: string;
    gameUrl: string | null;
    thumbnailUrl: string | null;
    category: string;
    tags: string[];
    playCount: number;
    averageRating: number;
    createdAt: string; // ISO date from backend
    status: GameStatus; // use the literal type
}
export interface GameStatusResponse {
    id: number;
    gameStatus: "DRAFT" | "UPLOADING" | "PROCESSING" | "PUBLISHED" | "FAILED";
    gameUrl: string | null;
    errorMessage: string | null;
}