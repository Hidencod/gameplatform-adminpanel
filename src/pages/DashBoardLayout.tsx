import { NavLink, Outlet } from "react-router-dom";
import { Gamepad, Home, User, Search, Bell, Settings, Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    {sidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">GameHub</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Home size={20} />
                        {sidebarOpen && <span className="font-medium">Dashboard</span>}
                    </NavLink>

                    <NavLink
                        to="/dashboard/users"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <User size={20} />
                        {sidebarOpen && <span className="font-medium">Users</span>}
                    </NavLink>

                    <NavLink
                        to="/dashboard/games"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <Gamepad size={20} />
                        {sidebarOpen && <span className="font-medium">Games</span>}
                    </NavLink>
                </nav>

                {/* Bottom Section */}
                {sidebarOpen && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                            <Settings size={20} />
                            <span className="font-medium">Settings</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Bar */}
                {/* <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm">
                            A
                        </div>
                    </div>
                </header> */}

                {/* Page Content */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}