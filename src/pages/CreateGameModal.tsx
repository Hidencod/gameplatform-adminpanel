import { useState } from "react";
import { X, Plus, Loader2, Gamepad2, Monitor, Smartphone, Globe } from "lucide-react";
import { createGame } from "../services/gameService";
import toast from "react-hot-toast";
import type { Game } from "../types/game";

interface CreateGameModalProps {
    onClose: () => void;
    onCreated: (game: Game) => void;
}

interface GameMetadata {
    name: string;
    description: string;
    category: string;
    tags: string[];
    platform: string;
}

const CATEGORIES = ["Action", "Puzzle", "Adventure", "Strategy", "Sports", "Racing", "Casual"];

const PLATFORMS = [
    { value: "BOTH", label: "Desktop & Mobile", icon: Globe, desc: "Works on all devices" },
    { value: "DESKTOP", label: "Desktop Only", icon: Monitor, desc: "PC & laptop browsers" },
    { value: "MOBILE", label: "Mobile Only", icon: Smartphone, desc: "Phone & tablet" },
];

const EMPTY: GameMetadata = { name: "", description: "", category: "", tags: [], platform: "BOTH" };

export default function CreateGameModal({ onClose, onCreated }: CreateGameModalProps) {
    const [metadata, setMetadata] = useState<GameMetadata>(EMPTY);
    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof GameMetadata, string>>>({});

    const validate = (): boolean => {
        const e: Partial<Record<keyof GameMetadata, string>> = {};
        if (!metadata.name.trim()) e.name = "Game name is required";
        if (!metadata.category) e.category = "Please select a category";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !metadata.tags.includes(tag)) {
            setMetadata(m => ({ ...m, tags: [...m.tags, tag] }));
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setMetadata(m => ({ ...m, tags: m.tags.filter(t => t !== tag) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await createGame(metadata);
            toast.success(`"${res.data.name}" created! 🎮`);
            onCreated(res.data as unknown as Game);
            onClose();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Failed to create game";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                <Gamepad2 size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Create New Game</h2>
                                <p className="text-xs text-white/70">Upload files later via Edit</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors focus:outline-none"
                        >
                            <X size={14} className="text-white" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="modal-scroll px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#a29bfe #f3f4f6" }}>
                            <style>{`
                                .modal-scroll::-webkit-scrollbar { width: 4px; }
                                .modal-scroll::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 4px; }
                                .modal-scroll::-webkit-scrollbar-thumb { background: #a29bfe; border-radius: 4px; }
                            `}</style>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Game Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="e.g. Space Shooter"
                                    value={metadata.name}
                                    onChange={e => {
                                        setMetadata(m => ({ ...m, name: e.target.value }));
                                        setErrors(er => ({ ...er, name: undefined }));
                                    }}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${errors.name ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white"}`}
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Describe your game..."
                                    value={metadata.description}
                                    onChange={e => setMetadata(m => ({ ...m, description: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={metadata.category}
                                    onChange={e => {
                                        setMetadata(m => ({ ...m, category: e.target.value }));
                                        setErrors(er => ({ ...er, category: undefined }));
                                    }}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-gray-800 ${errors.category ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white"}`}
                                >
                                    <option value="">Select category...</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
                            </div>

                            {/* Platform */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Platform
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PLATFORMS.map(p => {
                                        const Icon = p.icon;
                                        const selected = metadata.platform === p.value;
                                        return (
                                            <button
                                                key={p.value}
                                                type="button"
                                                onClick={() => setMetadata(m => ({ ...m, platform: p.value }))}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all focus:outline-none ${selected
                                                        ? "border-purple-400 bg-purple-50 text-purple-700"
                                                        : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                                                    }`}
                                            >
                                                <Icon size={16} />
                                                <span className="text-xs font-semibold leading-tight text-center">{p.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Tags
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a tag..."
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                                        className="flex-1 px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none"
                                    >
                                        <Plus size={15} />
                                    </button>
                                </div>
                                {metadata.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {metadata.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-purple-900 focus:outline-none">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none"
                                style={{ flex: 2 }}
                            >
                                {loading ? (
                                    <><Loader2 size={14} className="animate-spin" />Creating...</>
                                ) : (
                                    <><Plus size={14} />Create Game</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}