import {api} from "./api.ts"

export const getUsers= async(page=0,size=1, search?:string)=>
    {
        return await api.get("/admin/users",{
            params:{page,size,search}
        });
    }

export const getUserById=(id:string)=>api.get(`/admin/users/${id}`);