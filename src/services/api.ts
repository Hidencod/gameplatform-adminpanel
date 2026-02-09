import axios from "axios";
import { navigateTo } from "../utils/navigation";
import { logout } from "./authService";
let isLoggingOut = false;
export const api = axios.create(
    {
        baseURL:import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    }
)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
})
api.interceptors.response.use(
    res => res,
    err=>{
        if(err.response && err.response.status === 401 && !isLoggingOut)
        {
            isLoggingOut = true;
            logout().finally(()=>{
                navigateTo("/login");
                isLoggingOut = false;
            })
           
        }
        if (err.response.status === 403) {
            navigateTo("/unauthorized");
        }
        return Promise.reject(err);
    }
)