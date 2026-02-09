import type React from "react";

interface GameStatusCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
}

export default function GameStatusCard({ title, count, icon, color }: GameStatusCardProps) {
    // Map the color prop to softer pastel backgrounds
    const colorMap: { [key: string]: string } = {
        "bg-green-500": "from-emerald-100 to-teal-100 border-emerald-200",
        "bg-yellow-500": "from-amber-100 to-yellow-100 border-amber-200",
        "bg-red-500": "from-rose-100 to-pink-100 border-rose-200",
    };

    const iconColorMap: { [key: string]: string } = {
        "bg-green-500": "text-emerald-600",
        "bg-yellow-500": "text-amber-600",
        "bg-red-500": "text-rose-600",
    };

    const bgGradient = colorMap[color] || "from-gray-100 to-gray-200 border-gray-200";
    const iconColor = iconColorMap[color] || "text-gray-600";

    return (
        <div className={`relative bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px]`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`${iconColor} text-2xl`}>
                    {icon}
                </div>
                <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {title}
                </h2>
            </div>
            <div className="text-4xl font-bold text-gray-800">
                {count}
            </div>
        </div>
    );
}