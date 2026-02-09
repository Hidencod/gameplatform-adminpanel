import React, {createContext, useContext, useState, useEffect } from "react";

type UserRole = "ROLE_ADMIN" | "ROLE_USER" | null;

interface AuthContextType
{
    token:string | null;
    role:UserRole;
    isAuthenticated:boolean;
    login:(token:string, role:UserRole)=>void;
    logout:()=>void;
    loading:boolean;
}
const  AuthContext = createContext<AuthContextType|null>(null);

export const AuthProvider = ({children}:{children:React.ReactNode}) =>
{
    const [token , SetToken] = useState<string|null>(null);
    const [role, SetRole] = useState<UserRole>(null);
    const [loading, SetLoading] = useState(true);
    useEffect(()=>
    {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role") as UserRole;
        if(storedToken && storedRole)
        {
            SetToken(storedToken);
            SetRole(storedRole);
        }
        SetLoading(false);
    },[]);
    const login = (token:string, role:UserRole)=>
    {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || "");
        SetToken(token);
        SetRole(role);
         
    }
    const logout = ()=>
    {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        SetToken(null);
        SetRole(null);
    }
    return(
        <AuthContext.Provider value={
            {
                token:token,
                role:role,
                isAuthenticated:!!token,
                login,
                logout,
                loading
            }

        }>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth=() =>
{
    const ctx = useContext(AuthContext)
    if(!ctx)
    {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return ctx;
}