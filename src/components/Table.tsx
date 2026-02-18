import type React from "react";
import { useState } from "react";
import { Search, Filter, Download, Plus } from "lucide-react";

export interface Columns<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
}

interface ImprovedTableProps<T> {
    gridCols: string;
    data: T[];
    columns: Columns<T>[];
    title?: string;
    onAdd?: () => void;
    onExport?: () => void;
    onEditGame?:(row:T)=>void;
    onDelete?:(row:T) => void;
    onSearchTerm: string;
    onSearchTermChange: (term: string) => void;
}

export default function Table<T>({ data, columns, gridCols, title, onAdd, onExport, onEditGame, onDelete, onSearchTerm, onSearchTermChange }: ImprovedTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState(onSearchTerm);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const toggleRow = (index: number) => {
        setSelectedRows(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleAll = () => {
        setSelectedRows(selectedRows.length === data.length ? [] : data.map((_, i) => i));
    };

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div>
                    {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
                    <p className="text-sm text-gray-500 mt-1">{data.length} total entries</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <Download size={16} />
                        <span className="text-sm font-medium">Export</span>
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 shadow-sm hover:shadow-md transition-all"
                    >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Add New</span>
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            onSearchTermChange(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border text-blue-400 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filters</span>
                </button>
            </div>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="text-sm font-medium text-purple-700">
                        {selectedRows.length} selected
                    </span>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                        Delete
                    </button>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                        Export
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {/* Table Header */}
                <div className={`grid ${gridCols} text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100 px-6 py-4`}>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedRows.length === data.length && data.length > 0}
                            onChange={toggleAll}
                            className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-400 focus:ring-2"
                        />
                    </div>
                    {columns.map(col => (
                        <div key={col.key} className="flex items-center cursor-pointer hover:text-gray-700 transition-colors">
                            {col.header}
                        </div>
                    ))}
                    <div className="flex items-center">Actions</div>
                </div>

                {/* Table Body */}
                {data.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No data found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    data.map((row, i) => (
                        <div
                            key={i}
                            className={`grid ${gridCols} px-6 py-4 border-b border-gray-50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-150 ${selectedRows.includes(i) ? 'bg-purple-50' : ''
                                }`}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(i)}
                                    onChange={() => toggleRow(i)}
                                    className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-400 focus:ring-2"
                                />
                            </div>
                            {columns.map((col, index) => (
                                <div key={index} className="flex items-center text-gray-700 text-sm">
                                    {col.render(row)}
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-150"
                                    title="Edit"
                                    onClick={()=>onEditGame?.(row)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-150"
                                    title="Delete" 
                                    onClick={()=>onDelete?.(row)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}