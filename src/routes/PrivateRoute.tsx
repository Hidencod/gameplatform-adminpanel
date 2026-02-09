import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface PrivateRouteProps{
    role?:'ROLE_ADMIN'|'ROLE_USER';
}
export default function PrivateRoute({role}:PrivateRouteProps)
{
    const {isAuthenticated, role:userRole, loading} = useAuth();
    if(loading)
    {
        return(
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        )
    }
    if(!isAuthenticated)
    {
        return <Navigate to = "/login" replace />
    }
    if(role && role != userRole)
    {
        return <Navigate to = "/unauthorized" replace />
    }
    return <Outlet/>;
}