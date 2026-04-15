import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
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
}

const CATEGORIES = ["Action", "Puzzle", "Adventure", "Strategy", "Sports", "Racing", "Casual"];

const EMPTY: GameMetadata = { name: "", description: "", category: "", tags: [] };

export default function CreateGameModal({ onClose, onCreated }: CreateGameModalProps) {
    const [metadata, setMetadata] = useState<GameMetadata>(EMPTY);
    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<GameMetadata>>({});

    const validate = (): boolean => {
        const e: Partial<GameMetadata> = {};
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
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Create New Game</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Fill in the details — upload files later via Edit
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${errors.name ? "border-rose-300 bg-rose-50" : "border-gray-200"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Describe your game..."
                                    value={metadata.description}
                                    onChange={e => setMetadata(m => ({ ...m, description: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={metadata.category}
                                    onChange={e => {
                                        setMetadata(m => ({ ...m, category: e.target.value }));
                                        setErrors(er => ({ ...er, category: undefined }));
                                    }}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all ${errors.category ? "border-rose-300 bg-rose-50" : "border-gray-200"
                                        }`}
                                >
                                    <option value="">Select a category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.category}</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tags
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a tag..."
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {metadata.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {metadata.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-purple-900 transition-colors"
                                                >
                                                    <X size={11} />
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
                                className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={15} />
                                        Create Game
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}