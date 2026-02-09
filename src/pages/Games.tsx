import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import type { Columns } from "../components/Table";
import ImprovedTable from "../components/Table";
import type { Game } from "../types/game";
import { getGames } from "../services/gameService";
import { Star, TrendingUp, Users, Gamepad2 } from "lucide-react";
import { navigateTo } from "../utils/navigation";

export default function Games() {
    const [games, setGames] = useState<Game[]>([]);
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 0;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getGames(page, 10).then((res) => {
            setGames(res.data.content);
            setTotalPages(res.data.totalPages);
        });
    }, [page]);

    // Calculate stats from games data
    const totalGames = games.length;
    const totalPlays = games.reduce((sum, game) => sum + game.playCount, 0);
    const avgRating = games.length > 0
        ? (games.reduce((sum, game) => sum + game.averageRating, 0) / games.length).toFixed(1)
        : "0.0";

    const gameColumns: Columns<Game>[] = [
        {
            key: "game",
            header: "Game",
            render: (game) => (
                <div className="flex items-center gap-3">
                    {game.thumbnailUrl ? (
                        <img
                            src={game.thumbnailUrl}
                            alt={game.name}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {game.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{game.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{game.description}</p>
                    </div>
                </div>
            )
        },
        {
            key: "category",
            header: "Category",
            render: (game) => (
                <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {game.category}
                </span>
            )
        },
        {
            key: "tags",
            header: "Tags",
            render: (game) => (
                <div className="flex flex-wrap gap-1">
                    {game.tags.slice(0, 2).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-600"
                        >
                            {tag}
                        </span>
                    ))}
                    {game.tags.length > 2 && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            +{game.tags.length - 2}
                        </span>
                    )}
                </div>
            )
        },
        {
            key: "stats",
            header: "Performance",
            render: (game) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{game.playCount.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs">plays</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-gray-700 font-medium text-sm">{game.averageRating.toFixed(1)}</span>
                        <span className="text-gray-400 text-xs">rating</span>
                    </div>
                </div>
            )
        },
        {
            key: "link",
            header: "Link",
            render: (game) => (
                game.gameUrl ? (
                    <a
                        href={game.gameUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                    >
                        Play
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                ) : (
                    <span className="text-xs text-gray-400">No link</span>
                )
            )
        }
    ];

    const gridCols = "grid-cols-[50px_2.5fr_1.2fr_1.5fr_1.5fr_100px_100px]";

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Games</p>
                            <p className="text-2xl font-bold text-gray-800">{totalGames}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">+8 new</span>
                        <span className="text-gray-400">this week</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Plays</p>
                            <p className="text-2xl font-bold text-gray-800">{totalPlays.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">+15.3%</span>
                        <span className="text-gray-400">vs last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Avg. Rating</p>
                            <p className="text-2xl font-bold text-gray-800">{avgRating}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">+0.3</span>
                        <span className="text-gray-400">improvement</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Trending</p>
                            <p className="text-2xl font-bold text-gray-800">24</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">Hot</span>
                        <span className="text-gray-400">this week</span>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium text-sm whitespace-nowrap shadow-sm">
                    All Games
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 font-medium text-sm whitespace-nowrap transition-colors">
                    Action
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 font-medium text-sm whitespace-nowrap transition-colors">
                    Puzzle
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 font-medium text-sm whitespace-nowrap transition-colors">
                    Adventure
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 font-medium text-sm whitespace-nowrap transition-colors">
                    Strategy
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 font-medium text-sm whitespace-nowrap transition-colors">
                    Sports
                </button>
            </div>

            {/* Games Table */}
            <ImprovedTable
                data={games}
                columns={gameColumns}
                gridCols={gridCols}
                title="All Games"
                onAdd={() => navigateTo("/dashboard/games/upload")}
                onExport={() => console.log("Export games")}
            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(currentPage) => setParams({
                    page: currentPage.toString()
                })}
            />
        </div>
    );
}