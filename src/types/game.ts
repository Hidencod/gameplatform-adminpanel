export type GameStatus = "DRAFT" | "UPLOADING" | "PROCESSING" | "PUBLISHED" | "FAILED";

export interface Game {
    id: number;
    gameId: string;        // ← public facing ID like gm_a4f9b2c1
    name: string;
    description: string;
    gameUrl: string | null;
    thumbnailUrl: string | null;
    category: string;
    tags: string[];
    playCount: number;
    averageRating: number;
    createdAt: string;
    status: GameStatus;
}

export interface GameStatusResponse {
    id: number;
    gameStatus: "DRAFT" | "UPLOADING" | "PROCESSING" | "PUBLISHED" | "FAILED";
    gameUrl: string | null;
    errorMessage: string | null;
}