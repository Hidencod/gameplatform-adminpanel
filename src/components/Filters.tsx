import React from "react";

interface FilterOption {
    key: string;
    label: string;
    type: "select" | "checkbox" | "text";
    options?: { label: string; value: any }[]; // for select
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

    return (
        <div className="flex gap-4 flex-wrap">
            {filterOptions.map(filter => {
                if (filter.type === "select" && filter.options) {
                    return (
                        <select
                            key={filter.key}
                            value={filters[filter.key] || ""}
                            onChange={(e) => handleChange(filter.key, e.target.value)}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    );
                }
                if (filter.type === "checkbox") {
                    return (
                        <label key={filter.key} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={filters[filter.key] || false}
                                onChange={(e) => handleChange(filter.key, e.target.checked)}
                            />
                            {filter.label}
                        </label>
                    );
                }
                // default to text input
                return (
                    <input
                        key={filter.key}
                        type="text"
                        placeholder={filter.label}
                        value={filters[filter.key] || ""}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                        className="px-3 py-2 border rounded"
                    />
                );
            })}
        </div>
    );
}