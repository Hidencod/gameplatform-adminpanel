import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import type { Columns } from "../components/Table";
import ImprovedTable from "../components/Table";
import type { Game } from "../types/game";
import { deleteGame, getGames } from "../services/gameService";
import { Star, TrendingUp, Users, Gamepad2, Trash2 } from "lucide-react";
import { navigateTo } from "../utils/navigation";
import toast, { Toaster } from "react-hot-toast";
import { exportGamesToExcel } from "../utils/xlsx";

export default function Games() {
    const [games, setGames] = useState<Game[]>([]);
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 0;
    const [totalPages, setTotalPages] = useState(1);
    const [totalGames, setTotalGames] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        getGames(page, 10, debouncedSearch).then((res) => {
            setGames(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalGames(res.data.totalElements);
        });
    }, [page, debouncedSearch]);

    const handleDeleteClick = (game: Game) => {
        setGameToDelete(game);
        setShowDeleteModal(true);
    };


    const handleDeleteConfirm = async () => {
        if (!gameToDelete) return;

        setShowDeleteModal(false);

        try {
            const resp = await deleteGame(gameToDelete.id);
            console.log(resp);

            // Success toast with custom styling
            toast.success(
                (t) => (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Game Deleted!</p>
                            <p className="text-sm text-gray-600">{gameToDelete.name} has been removed</p>
                        </div>
                    </div>
                ),
                {
                    duration: 3000,
                    style: {
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                }
            );

            setGames(prev => prev.filter(g => g.id !== gameToDelete.id));
        } catch (error) {
            // Error toast
            toast.error(
                (t) => (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Delete Failed</p>
                            <p className="text-sm text-gray-600">Could not delete the game</p>
                        </div>
                    </div>
                ),
                {
                    duration: 3000,
                    style: {
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                }
            );
        } finally {
            setGameToDelete(null);
        }
    };
    const handleEditGame = (game:any)=>
    {
        navigateTo('/dashboard/games/upload', {
            state: {
                gameId: game.id,
                gameData: game  // Pass entire game object
            }
        })
    }


    // Calculate stats from games data
    const totalPlays = games.reduce((sum, game) => sum + game.playCount, 0);
    const avgRating = games.length > 0
        ? (games.reduce((sum, game) => sum + game.averageRating, 0) / games.length).toFixed(1)
        : "0.0";
    const statusStyles = {
        DRAFT: "bg-gray-100 text-gray-700",
        UPLOADING: "bg-blue-100 text-blue-700",
        PROCESSING: "bg-yellow-100 text-yellow-700",
        PUBLISHED: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
    };
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
        },
        {
            key: "status",
            header: "Status",
            render: (game) => (
                <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${statusStyles[game.status] || "bg-gray-100 text-gray-700"
                        }`}
                >
                    {game.status}
                </span>
            )
        }
    ];

    const gridCols = "grid-cols-[50px_2.5fr_1.2fr_1.3fr_1.5fr_100px_150px_100px]";

    return (
        
        <div className="space-y-6">
            <Toaster position="top-right" />
            {/* Delete Confirmation Modal */}
            {showDeleteModal && gameToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in duration-300">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="relative mx-auto w-20 h-20 mb-6">
                                <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-full p-4 shadow-lg">
                                        <Trash2 className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Game?</h3>
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete <span className="font-semibold text-gray-800">"{gameToDelete.name}"</span>?
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                This action cannot be undone. All game data will be permanently removed.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setGameToDelete(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                onExport={() => exportGamesToExcel(games)}
                onDelete={(game) => handleDeleteClick(game)}
                onEditGame={(game)=>handleEditGame(game)}
                onSearchTerm={search}
                onSearchTermChange={(term) => setSearch(term)}
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