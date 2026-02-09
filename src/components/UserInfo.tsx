interface UserInfoProps {
    count: string;
    label?: string;
    icon?: React.ReactNode;
}

export default function UserInfo({ count, label = "Total Users", icon }: UserInfoProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-600">{label}</div>
                {icon && <div className="text-blue-600">{icon}</div>}
            </div>
            <div className="text-3xl font-bold text-gray-900">{count}</div>
            <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +12%
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
            </div>
        </div>
    );
}