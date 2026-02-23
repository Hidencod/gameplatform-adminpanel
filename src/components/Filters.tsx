import React from "react";

interface FilterOption {
    key: string;
    label: string;
    type: "select" | "checkbox" | "text";
    options?: { label: string; value: any }[];
}

interface FiltersProps {
    filters: Record<string, any>;
    setFilters: (filters: Record<string, any>) => void;
    filterOptions: FilterOption[];
}

export default function Filters({ filters, setFilters, filterOptions }: FiltersProps) {
    const handleChange = (key: string, value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    const activeCount = filterOptions.filter(f => {
        const v = filters[f.key];
        return v !== undefined && v !== "" && v !== false;
    }).length;

    const clearAll = () => {
        const reset: Record<string, any> = {};
        filterOptions.forEach(f => (reset[f.key] = f.type === "checkbox" ? false : ""));
        setFilters(reset);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map(filter => {
                if (filter.type === "select" && filter.options) {
                    const hasValue = !!filters[filter.key];
                    return (
                        <div key={filter.key} className="relative">
                            <select
                                value={filters[filter.key] || ""}
                                onChange={(e) => handleChange(filter.key, e.target.value)}
                                className={`
                                    appearance-none pl-3 pr-8 py-2 text-sm font-medium rounded-xl border
                                    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                    transition-all cursor-pointer
                                    ${hasValue
                                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }
                                `}
                            >
                                <option value="">{filter.label}</option>
                                {filter.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {/* Chevron icon */}
                            <div className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${hasValue ? "text-white/70" : "text-gray-400"}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    );
                }

                if (filter.type === "checkbox") {
                    const checked = filters[filter.key] || false;
                    return (
                        <button
                            key={filter.key}
                            onClick={() => handleChange(filter.key, !checked)}
                            className={`
                                flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border
                                transition-all focus:outline-none focus:ring-2 focus:ring-purple-400
                                ${checked
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-sm"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                }
                            `}
                        >
                            <span className={`
                                w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0
                                ${checked ? "bg-white/20 border-white/40" : "bg-white border-gray-300"}
                            `}>
                                {checked && (
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </span>
                            {filter.label}
                        </button>
                    );
                }

                // text input
                return (
                    <div key={filter.key} className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder={filter.label}
                            value={filters[filter.key] || ""}
                            onChange={(e) => handleChange(filter.key, e.target.value)}
                            className="pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                                hover:border-gray-300 transition-all"
                        />
                    </div>
                );
            })}

            {/* Clear all — only shown when filters are active */}
            {activeCount > 0 && (
                <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-400
                        bg-white border border-gray-200 rounded-xl hover:text-rose-500 hover:border-rose-200
                        hover:bg-rose-50 transition-all focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Clear
                    <span className="ml-0.5 bg-gray-100 text-gray-500 text-xs font-semibold px-1.5 py-0.5 rounded-lg">
                        {activeCount}
                    </span>
                </button>
            )}
        </div>
    );
}