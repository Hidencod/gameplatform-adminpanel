import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../types/game";
import { deleteGame, getGames } from "../services/gameService";
import { navigateTo } from "../utils/navigation";
import toast, { Toaster } from "react-hot-toast";
import { exportGamesToExcel } from "../utils/xlsx";
import {
    Trash2, Download, Search, ChevronLeft, ChevronRight,
    Gamepad2, Star, Users, TrendingUp, Plus, ExternalLink, X, Copy, Check
} from "lucide-react";

type GameFilters = { category?: string; status?: string };

const STATUS_STYLES: Record<string, string> = {
    PUBLISHED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    DRAFT: "bg-gray-100 text-gray-600",
    UPLOADING: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    PROCESSING: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    FAILED: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
};

const STATUS_DOT: Record<string, string> = {
    PUBLISHED: "bg-emerald-500",
    DRAFT: "bg-gray-400",
    UPLOADING: "bg-blue-500 animate-pulse",
    PROCESSING: "bg-amber-500 animate-pulse",
    FAILED: "bg-rose-500",
};

const CATEGORY_STYLES: Record<string, string> = {
    ACTION: "bg-blue-50 text-blue-700",
    ADVENTURE: "bg-purple-50 text-purple-700",
    STRATEGY: "bg-amber-50 text-amber-700",
    PUZZLE: "bg-teal-50 text-teal-700",
    SPORTS: "bg-emerald-50 text-emerald-700",
    RACING: "bg-rose-50 text-rose-700",
    CASUAL: "bg-orange-50 text-orange-700",
};

const THUMB_COLORS = [
    "from-purple-400 to-pink-500",
    "from-blue-400 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
];

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Copy Game ID"
        >
            {copied
                ? <Check size={12} className="text-emerald-500" />
                : <Copy size={12} className="text-gray-400 hover:text-gray-600" />
            }
        </button>
    );
}

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
    const [filters, setFilters] = useState<GameFilters>({});

    useEffect(() => {
        const h = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(h);
    }, [search]);

    useEffect(() => { fetchGames(); }, [page, filters, debouncedSearch]);

    const fetchGames = () => {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
        );
        getGames(page, 10, debouncedSearch, activeFilters).then(res => {
            setGames(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalGames(res.data.totalElements);
        });
    };

    const handleDeleteConfirm = async () => {
        if (!gameToDelete) return;
        setShowDeleteModal(false);
        try {
            await deleteGame(gameToDelete.id);
            toast.success(`"${gameToDelete.name}" deleted`);
            setGames(prev => prev.filter(g => g.id !== gameToDelete.id));
            fetchGames();
        } catch {
            toast.error("Failed to delete game");
        } finally {
            setGameToDelete(null);
        }
    };

    const totalPlays = games.reduce((s, g) => s + g.playCount, 0);
    const avgRating = games.length
        ? (games.reduce((s, g) => s + (Number(g.averageRating) || 0), 0) / games.length).toFixed(1)
        : "—";

    const getThumbColor = (name: string) =>
        THUMB_COLORS[name.charCodeAt(0) % THUMB_COLORS.length];

    const hasActiveFilters = filters.category || filters.status;

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Delete Modal */}
            {showDeleteModal && gameToDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={20} className="text-rose-600" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete game?</h3>
                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">"{gameToDelete.name}"</span> will be permanently removed along with all its data.
                            </p>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setGameToDelete(null); }}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Games</h1>
                <p className="text-sm text-gray-500 mt-1">Manage, publish and monitor your game catalog.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total games", value: totalGames.toLocaleString(), icon: <Gamepad2 size={18} />, color: "from-purple-400 to-purple-600", badge: "+8 this week" },
                    { label: "Total plays", value: totalPlays.toLocaleString(), icon: <Users size={18} />, color: "from-blue-400 to-blue-600", badge: "+15.3%" },
                    { label: "Avg. rating", value: avgRating, icon: <Star size={18} />, color: "from-amber-400 to-amber-600", badge: "this page" },
                    { label: "Trending", value: "24", icon: <TrendingUp size={18} />, color: "from-emerald-400 to-emerald-600", badge: "this week" },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                            {stat.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 leading-tight">{stat.value}</p>
                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-md">{stat.badge}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                        <h2 className="text-base font-semibold text-gray-800 whitespace-nowrap">All games</h2>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {totalGames.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search games…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent w-full sm:w-52 transition-all"
                            />
                        </div>
                        <select
                            value={filters.category || ""}
                            onChange={e => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
                            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                        >
                            <option value="">All categories</option>
                            {["ACTION", "ADVENTURE", "STRATEGY", "PUZZLE", "SPORTS", "RACING", "CASUAL"].map(c => (
                                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                        <select
                            value={filters.status || ""}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value || undefined }))}
                            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                        >
                            <option value="">All statuses</option>
                            {["PUBLISHED", "DRAFT", "UPLOADING", "PROCESSING", "FAILED"].map(s => (
                                <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                        {hasActiveFilters && (
                            <button
                                onClick={() => setFilters({})}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
                            >
                                <X size={13} /> Clear
                            </button>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => exportGamesToExcel(games)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Download size={14} /> Export
                            </button>
                            <button
                                onClick={() => navigateTo("/dashboard/games/upload")}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm"
                            >
                                <Plus size={14} /> Upload
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {["Game", "Game ID", "Category", "Tags", "Performance", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap first:pl-5">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {games.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Gamepad2 size={20} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">No games found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : games.map(game => (
                                <tr key={game.id} className="hover:bg-gray-50/80 transition-colors">

                                    {/* Game */}
                                    <td className="pl-5 pr-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {game.thumbnailUrl ? (
                                                <img src={game.thumbnailUrl} alt={game.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getThumbColor(game.name)} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                                                    {game.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">{game.name}</p>
                                                <p className="text-xs text-gray-400 truncate max-w-[160px]">{game.description}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Game ID — the key column */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg border border-purple-100">
                                                {game.gameId ?? "—"}
                                            </span>
                                            {game.gameId && <CopyButton text={game.gameId} />}
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${CATEGORY_STYLES[game.category] ?? "bg-gray-100 text-gray-600"}`}>
                                            {game.category
                                                ? game.category.charAt(0) + game.category.slice(1).toLowerCase()
                                                : "—"}
                                        </span>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {game.tags.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-500">{tag}</span>
                                            ))}
                                            {game.tags.length > 2 && (
                                                <span className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-400">+{game.tags.length - 2}</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Performance */}
                                    <td className="px-4 py-3.5">
                                        {game.playCount > 0 ? (
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <Users size={12} className="text-gray-400" />
                                                    <span className="font-medium text-gray-700">{game.playCount.toLocaleString()}</span>
                                                    <span className="text-xs text-gray-400">plays</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-sm font-medium text-gray-700">{(Number(game.averageRating) || 0).toFixed(1)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300">—</span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[game.status] ?? "bg-gray-100 text-gray-600"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[game.status] ?? "bg-gray-400"}`} />
                                            {game.status.charAt(0) + game.status.slice(1).toLowerCase()}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            {game.gameUrl && (
                                                <a
                                                    href={game.gameUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="Play"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => navigateTo("/dashboard/games/upload", { state: { gameId: game.id, gameData: game } })}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { setGameToDelete(game); setShowDeleteModal(true); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-700">{page + 1}</span> of{" "}
                        <span className="font-medium text-gray-700">{totalPages}</span>
                        <span className="text-gray-400 ml-2">· {totalGames.toLocaleString()} total</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={page === 0}
                            onClick={() => setParams({ page: String(page - 1) })}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={15} /> Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setParams({ page: String(i) })}
                                className={`w-8 h-8 text-sm font-medium rounded-xl transition-all ${page === i
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setParams({ page: String(page + 1) })}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}