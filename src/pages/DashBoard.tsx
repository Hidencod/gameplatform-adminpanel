import { FaCheckCircle, FaPen, FaTimesCircle, FaUsers, FaGamepad, FaTrophy } from "react-icons/fa";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
    const stats = [
        {
            title: "Total Users",
            value: "2,543",
            change: "+12.5%",
            trend: "up",
            icon: <FaUsers className="text-2xl" />,
            color: "from-blue-400 to-blue-600",
        },
        {
            title: "Active Games",
            value: "127",
            change: "+8.2%",
            trend: "up",
            icon: <FaGamepad className="text-2xl" />,
            color: "from-purple-400 to-purple-600",
        },
        {
            title: "Revenue",
            value: "$45.2k",
            change: "+23.1%",
            trend: "up",
            icon: <FaTrophy className="text-2xl" />,
            color: "from-emerald-400 to-emerald-600",
        },
        {
            title: "Avg. Playtime",
            value: "3.2h",
            change: "-2.4%",
            trend: "down",
            icon: <FaCheckCircle className="text-2xl" />,
            color: "from-amber-400 to-amber-600",
        },
    ];

    const gameStatuses = [
        { title: "Published", count: 87, color: "bg-emerald-500", percentage: 68 },
        { title: "Draft", count: 28, color: "bg-amber-500", percentage: 22 },
        { title: "Failed", count: 12, color: "bg-rose-500", percentage: 10 },
    ];

    const recentActivity = [
        { user: "John Doe", action: "Published new game", game: "Space Adventure", time: "2 min ago" },
        { user: "Jane Smith", action: "Updated game", game: "Puzzle Master", time: "15 min ago" },
        { user: "Mike Johnson", action: "Deleted draft", game: "Racing Pro", time: "1 hour ago" },
        { user: "Sarah Wilson", action: "Created draft", game: "Card Quest", time: "2 hours ago" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard Overview</h1>
                <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                }`}>
                                {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Game Status */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Game Status Distribution</h2>
                    <div className="space-y-4">
                        {gameStatuses.map((status) => (
                            <div key={status.title}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                        <span className="text-sm font-medium text-gray-700">{status.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">{status.percentage}%</span>
                                        <span className="text-lg font-bold text-gray-800">{status.count}</span>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${status.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${status.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Stats</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">New Users Today</p>
                            <p className="text-2xl font-bold text-gray-800">+47</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Games Played Today</p>
                            <p className="text-2xl font-bold text-gray-800">1,234</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Avg. Session</p>
                            <p className="text-2xl font-bold text-gray-800">42 min</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {activity.user.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800">
                                    <span className="font-medium">{activity.user}</span>{" "}
                                    <span className="text-gray-500">{activity.action}</span>{" "}
                                    <span className="font-medium text-purple-600">{activity.game}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}