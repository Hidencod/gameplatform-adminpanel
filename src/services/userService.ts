import {api} from "./api.ts"

export const getUsers = async (
    page = 0,
    size = 1,
    search?: string,
    filters: Record<string, any> = {}
) => {
    const params: Record<string, any> = { page, size, ...filters };
    if (search && search.trim() !== "") params.search = search;

    // Remove undefined/null keys
    Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === "") {
            delete params[key];
        }
    });
    return await api.get("/admin/users", {
        params
    });
};
export const getUserById=(id:string)=>api.get(`/admin/users/${id}`);
export const deleteUserById = async(id:number)=>{ return await api.delete(`/admin/users/${id}`)};