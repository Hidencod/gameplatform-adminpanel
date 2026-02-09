import { api } from "./api";

export const getGames = async (page:number, size:number)=>
{
    return await api.get("/api/games",
        {
            params:{
                page, size
            }
        }
    );
}
export const createGame = async (metadata: any) => {
    return api.post("/api/games", metadata);
};
