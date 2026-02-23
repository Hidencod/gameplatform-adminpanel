import { use, useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import type { User } from "../types/user";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import type { Columns } from "../components/Table";
import ImprovedTable from "../components/Table";
import { exportUsersToExcel } from "../utils/xlsx";
import { Filter } from "lucide-react";
import Filters from "../components/Filters";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 0;
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search,setSearch] = useState("");
    const [debouncedSearch,setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, any>>({ role: "", active: "" });

    useEffect(()=>
    {
        const timer = setTimeout(()=>{
            setDebouncedSearch(search);
        },400);
        return()=>clearTimeout(timer);
    })

    useEffect(() => {
        getUsers(page, 10, debouncedSearch, filters).then((res) => {
           
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalUsers(res.data.totalElements);
        });
    }, [page,filters, debouncedSearch]);
    const userFilterOptions = [
        {
            key: "role", label: "Role", type: "select", options: [
                { label: "Admin", value: "ROLE_ADMIN" },
                { label: "User", value: "ROLE_USER" },
            ]
        },
        { key: "active", label: "Active", type: "checkbox" }
    ];
    const userColumns: Columns<User>[] = [
        {
            key: "user",
            header: "User",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: "role",
            header: "Role",
            render: (user) => (
                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {user.role}
                </span>
            )
        },
        {
            key: "status",
            header: "Status",
            render: (user) => (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {user.active ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            key: "joined",
            header: "Joined",
            render: (user) => (
                <span className="text-sm text-gray-600">{user.createdAt}</span>
            )
        }
    ];

    const gridCols = "grid-cols-[50px_2.5fr_1.5fr_1.5fr_1.5fr_100px]";

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Users</p>
                            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
                        <span className="text-gray-400">vs last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Users</p>
                            <p className="text-2xl font-bold text-gray-800">1,892</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">+8.2%</span>
                        <span className="text-gray-400">vs last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">New Today</p>
                            <p className="text-2xl font-bold text-gray-800">47</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg">+23.1%</span>
                        <span className="text-gray-400">vs yesterday</span>
                    </div>
                </div>
            </div>
            
            {/* Users Table */}
            <ImprovedTable
                data={users}
                columns={userColumns}
                gridCols={gridCols}
                title="All Users"
                onExport={() => exportUsersToExcel(users)}
                onSearchTerm={search}
                onSearchTermChange={(term) => setSearch(term)}
                filterComponent={<Filters filters={filters} setFilters={setFilters} filterOptions={userFilterOptions} />
                }

            />

            {/* Pagination */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(currentPage) => setParams({
                    page: currentPage.toString()
                })}
            />
        </div>
    );
}