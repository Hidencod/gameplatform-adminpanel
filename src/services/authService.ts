import { api } from "./api";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (data:LoginRequest) =>{
    const response = await api.post<LoginResponse>("/auth/login",data);
    return response.data;
}
export const logout = (): Promise<void> => {
    return new Promise((resolve) => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        resolve();
    });
}
