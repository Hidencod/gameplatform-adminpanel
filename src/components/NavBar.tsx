import { NavLink } from "react-router-dom";
import { Gamepad, Home, User } from "lucide-react";
import "@fontsource/inter/200.css";

function NavBar() {
    return (
        <div className="px-8 py-4">
            <nav className="w-full bg-white rounded-2xl px-6 py-4 flex items-center justify-around shadow-sm border border-gray-100">
                <NavLink
                    to={"/dashboard"}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-br from-purple-50 to-blue-50 text-purple-600"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    <Home size={22} strokeWidth={2} />
                    <div className="text-sm font-medium">Dashboard</div>
                </NavLink>

                <NavLink
                    to={"/dashboard/users"}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-br from-purple-50 to-blue-50 text-purple-600"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    <User size={22} strokeWidth={2} />
                    <div className="text-sm font-medium">Users</div>
                </NavLink>

                <NavLink
                    to={"/dashboard/games"}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-br from-purple-50 to-blue-50 text-purple-600"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        }`
                    }
                >
                    <Gamepad size={22} strokeWidth={2} />
                    <div className="text-sm font-medium">Games</div>
                </NavLink>
            </nav>
        </div>
    );
}

export default NavBar;