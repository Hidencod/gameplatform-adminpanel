interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                    Page <span className="font-semibold text-gray-700">{page + 1}</span> of{" "}
                    <span className="font-semibold text-gray-700">{totalPages}</span>
                </span>
            </div>

            <div className="flex gap-2">
                <button
                    className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${page === 0
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:shadow-md active:scale-95'
                        }`}
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                >
                    ← Previous
                </button>

                <button
                    className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${page === totalPages - 1
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:shadow-md active:scale-95'
                        }`}
                    disabled={page === totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}