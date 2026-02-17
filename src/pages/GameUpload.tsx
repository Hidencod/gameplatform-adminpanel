import { useState, useEffect } from "react";
import { Upload, FileText, Tag, Loader2, CheckCircle, XCircle, ArrowLeft, Sparkles, Zap, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { createGame, getGameStatus, getGameZipStatus } from "../services/gameService";

interface GameMetadata {
    name: string;
    description: string;
    category: string;
    tags: string[];
}

type UploadStep = "metadata" | "upload" | "processing" | "complete" | "error";



export default function GameUpload() {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState<UploadStep>("metadata");
    const [gameId, setGameId] = useState<number | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [processingStatus, setProcessingStatus] = useState("");
    const [gameUrl, setGameUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {gameData} = location.state ||{};
    const [isEditing, setIsEditing] = useState(false);
    const [existingZip, setExistingZip] = useState<{
        fileName: string
        size: number
    } | null>(null);
    useEffect(()=>
    {
        if(gameData)
        {
            setIsEditing(true);
            console.log("Hello")
            setMetadata({
                name:gameData.name,
                description: gameData.description,
                category:gameData.category,
                tags:gameData.tags
            });
            setGameId(gameData.id);
            const checkExistingZip = async () => {
                if (gameData.id) {
                    console.log("Hello")
                    const res = await getGameZipStatus(gameData.id);
                    const data = await res.data;
                    console.log(data);
                    if (data.exists) {
                        setExistingZip({
                            fileName: data.fileName,
                            size: data.fileSize,
                        });
                    }
                };

                
            }
            
            checkExistingZip();
        }
    },[location.state])
    // Function to handle step navigation
    const canNavigateToStep = (targetStep: UploadStep): boolean => {
        if (isEditing) {
            // When editing, allow navigation to any step
            return true;
        }

        // When creating new game, enforce sequential flow
        const stepOrder = ["metadata", "upload", "processing", "complete"];
        const currentIndex = stepOrder.indexOf(step);
        const targetIndex = stepOrder.indexOf(targetStep);

        // Only allow going to current or previous steps
        return targetIndex <= currentIndex;
    };

    const goToStep = (targetStep: UploadStep) => {
        if (canNavigateToStep(targetStep)) {
            setStep(targetStep);
        }
    };
    // Metadata form
    const [metadata, setMetadata] = useState<GameMetadata>({
        name: "",
        description: "",
        category: "",
        tags: []
    });
    const [tagInput, setTagInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Categories
    const categories = ["Action", "Puzzle", "Adventure", "Strategy", "Sports", "Racing", "Casual"];

    // Step 1: Submit metadata and create game
    const handleMetadataSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if(isEditing && gameId)
            {
                setStep("upload");
                return;
            }
            const response = await createGame(metadata);

            const game = response.data;
            setGameId(game.id);
            setStep("upload");
        } catch (error) {
            console.error("Error creating game:", error);
            alert("Failed to create game. Please try again.");
        }

    };

    // Step 2: Upload file to R2
    const handleFileUpload = async () => {
        if (!selectedFile || !gameId) return;

        // Show immediate feedback
        setIsUploading(true);
        setUploadProgress(1);

        try {
            // 1. Get presigned URL (axios + auth)
            const { data } = await api.post(`/api/games/${gameId}/upload`);
            const { uploadUrl } = data;

            // 2. Upload file directly to R2 (raw PUT)
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setUploadProgress(Math.round(percentComplete));
                }
            });

            xhr.addEventListener("load", async () => {
                if (xhr.status === 200) {
                    // tell backend upload is done
                    await api.post(`/api/games/${gameId}/upload/complete`);

                    setIsUploading(false);
                    setStep("processing");
                    startPollingStatus();
                } else {
                    setIsUploading(false);
                    setStep("error");
                    setErrorMessage("Upload failed");
                }
            });


            xhr.addEventListener("error", () => {
                setIsUploading(false);
                setStep("error");
                setErrorMessage("Upload failed. Please try again.");
            });

            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", "application/zip");
            xhr.send(selectedFile);

        } catch (error) {
            console.error("Error uploading file:", error);
            setIsUploading(false);
            setStep("error");
            setErrorMessage("Upload failed. Please try again.");
        }
    };
    const handleProcessExistingZip = async()=>
    {
        if(!gameId) return;
        try {
            setStep("processing");
            await api.post(`/api/games/${gameId}/upload/complete`);
            startPollingStatus();
        }        catch(error)        {
            console.error("Error processing existing ZIP:", error);
            setStep("error");
            setErrorMessage("Failed to process existing ZIP. Please try again.");
        }
    }

    // Step 3: Poll for processing status
    const startPollingStatus = () => {
        const pollInterval = setInterval(async () => {
            try {
                if (gameId === null) return;
                const { data: status } = await getGameStatus(gameId);

                setProcessingStatus(status.gameStatus);

                if (status.gameStatus === "PUBLISHED") {
                    clearInterval(pollInterval);
                    setGameUrl(status.gameUrl);
                    setStep("complete");
                } else if (status.gameStatus === "FAILED") {
                    clearInterval(pollInterval);
                    setErrorMessage(status.errorMessage || "Processing failed");
                    setStep("error");
                }
            } catch (error: any) {
                console.error("Error polling status:", error.response?.data || error.message);
            }
        }, 2000);
    };


    // Handle tag addition
    const addTag = () => {
        if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
            setMetadata({
                ...metadata,
                tags: [...metadata.tags, tagInput.trim()]
            });
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setMetadata({
            ...metadata,
            tags: metadata.tags.filter(tag => tag !== tagToRemove)
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/dashboard/games")}
                        className="p-2 hover:bg-white rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">{isEditing ?"Edit Game" : "Upload Game"}</h1>
                        <p className="text-sm text-gray-500">{isEditing ? "Update your game details" :"Share your game with the world"}</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        {[
                            { key: "metadata", label: "Details", icon: FileText },
                            { key: "upload", label: "Upload", icon: Upload },
                            { key: "processing", label: "Processing", icon: Loader2 },
                            { key: "complete", label: "Done", icon: CheckCircle }
                        ].map((s, index) => {
                            const isActive = step === s.key;
                            const isPast = ["metadata", "upload", "processing", "complete"].indexOf(step) > index;
                            const Icon = s.icon;

                            return (
                                <div key={s.key} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" :
                                            isPast ? "bg-emerald-500 text-white" :
                                                "bg-gray-200 text-gray-400"
                                            }`}>
                                            <Icon className={`w-5 h-5 ${isActive && s.key === "processing" ? "animate-spin" : ""}`} />
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${isActive ? "text-purple-600" : isPast ? "text-emerald-600" : "text-gray-400"
                                            }`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {index < 3 && (
                                        <div className={`h-0.5 flex-1 ${isPast ? "bg-emerald-500" : "bg-gray-200"}`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Uploading Overlay */}
                {isUploading && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in duration-300">
                            <div className="text-center">
                                {/* Animated Icon */}
                                <div className="relative mx-auto w-24 h-24 mb-6">
                                    {/* Pulsing background circles */}
                                    <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75"></div>
                                    <div className="absolute inset-2 bg-purple-200 rounded-full animate-pulse"></div>

                                    {/* Upload icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-5 shadow-lg">
                                            <Upload className="w-8 h-8 text-white animate-bounce" />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {uploadProgress < 5 ? "Preparing Upload" : "Uploading Game"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {uploadProgress < 5
                                        ? "Getting everything ready..."
                                        : `${selectedFile?.name || "Your game"} is being uploaded`
                                    }
                                </p>

                                {/* Progress Circle */}
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="url(#gradient)"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 56}`}
                                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - uploadProgress / 100)}`}
                                            className="transition-all duration-300 ease-out"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#a855f7" />
                                                <stop offset="100%" stopColor="#3b82f6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{(selectedFile && selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    {/* Step 1: Metadata */}
                    {step === "metadata" && (
                        <form onSubmit={handleMetadataSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Game Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={metadata.name}
                                    onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    placeholder="Enter game name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={metadata.description}
                                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                                    placeholder="Describe your game..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={metadata.category}
                                    onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                        placeholder="Add tags (press Enter)"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {metadata.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-purple-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
                            >
                                Continue to Upload
                            </button>
                        </form>
                    )}
                    {step === "upload" && existingZip && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4 shadow-sm">

                            {/* ZIP info and button */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">{existingZip.fileName}</p>
                                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                                        <span>📦</span>
                                        <span>Size: {(existingZip.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </p>
                                </div>

                                <button
                                    onClick={handleProcessExistingZip}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                    Process ZIP File
                                </button>
                            </div>

                            {/* Message section */}
                            <div className="flex items-start space-x-2 bg-green-100 p-3 rounded-md">
                                <span className="text-green-500 text-lg mt-0.5">ℹ️</span>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    We found an existing ZIP file for this game. You can choose to process it or upload a new one.
                                </p>
                            </div>

                        </div>
                    )}


                    {/* Step 2: File Upload */}
                    {step === "upload" && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors">
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="file-upload"
                                    disabled={isUploading}
                                />
                                <label htmlFor="file-upload" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        {selectedFile ? selectedFile.name : "Click to select game ZIP file"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ZIP file containing index.html and game assets
                                    </p>
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                            <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={
                                         handleFileUpload
                                }
                                disabled={
                                    (!selectedFile) || isUploading
                                }
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedFile ? "Upload Game" : "Select a ZIP file first"}
                            </button>

                        </div>
                    )}

                    {/* Step 3: Processing */}
                    {step === "processing" && (
                        <div className="text-center py-12">
                            {/* Animated Processing Icon */}
                            <div className="relative mx-auto w-32 h-32 mb-8">
                                {/* Rotating rings */}
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-3 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                </div>

                                {/* Center icon that changes */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-full p-6 shadow-lg">
                                        <Package className="w-10 h-10 text-white animate-pulse" />
                                    </div>
                                </div>

                                {/* Sparkle effects */}
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-ping" />
                                <Zap className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-400 animate-bounce" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Processing Your Game</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                We're extracting files, optimizing assets, and preparing everything for launch. This usually takes less than a minute!
                            </p>

                            {/* Status badges */}
                            <div className="flex flex-col items-center gap-3 mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Status: {processingStatus}
                                </div>

                                {/* Processing steps indicator */}
                                <div className="flex gap-2">
                                    {['Extracting', 'Validating', 'Optimizing'].map((label, i) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 animate-pulse"
                                            style={{ animationDelay: `${i * 0.2}s` }}
                                        >
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Progress dots */}
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Complete */}
                    {step === "complete" && (
                        <div className="text-center py-12">
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                {/* Success burst animation */}
                                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-5 shadow-lg animate-in zoom-in duration-500">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
                                <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-emerald-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Game Published Successfully!</h3>
                            <p className="text-gray-600 mb-6">Your game is now live and ready to play.</p>
                            <div className="flex gap-3 justify-center">
                                <a
                                    href={gameUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
                                >
                                    Play Game
                                </a>
                                <button
                                    onClick={() => navigate("/dashboard/games")}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Back to Games
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {step === "error" && (
                        <div className="text-center py-12">
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-full p-5 shadow-lg">
                                        <XCircle className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload Failed</h3>
                            <p className="text-gray-600 mb-6">{errorMessage}</p>
                            <button
                                onClick={() => {
                                    setStep("metadata");
                                    setErrorMessage(null);
                                    setUploadProgress(0);
                                    setIsUploading(false);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}