import toast from "react-hot-toast";
import { api } from "./api";
import type { GameStatusResponse } from "../types/game";
import type ZipInfo from "../types/zipInfo";
export const getGames = async (page:number, size:number, search?:string)=>
{
    return await api.get("/api/games",
        {
            params:{
                page, size, search
            }
        }
    );
}
export const createGame = async (metadata: any) => {
    return api.post("/api/games", metadata);
};
export const updateGame = async(gameId:number, metadata:any)=>
{
    return api.put(`/api/games/${gameId}/update`,metadata);
}
export const deleteGame = async (gameid: number) => {
    return api.delete(`/api/games/${gameid}`);
};
export const getGameStatus = async(gameId:number)=>
{
    return await api.get<GameStatusResponse>(`api/games/${gameId}/status`)
}
export const getGameZipStatus = async (gameId:number)=>
{
    return await api.get<ZipInfo>(`api/games/${gameId}/zip-status`)
}