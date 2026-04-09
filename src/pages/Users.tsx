import { useEffect, useState } from "react";
import { deleteUserById, getUsers, updateUser } from "../services/userService";
import type { User } from "../types/user";
import { useSearchParams } from "react-router-dom";
import { exportUsersToExcel } from "../utils/xlsx";
import { toast, Toaster } from "react-hot-toast";
import {
    Trash2, Download, Search, ChevronLeft, ChevronRight,
    Users as UsersIcon, UserCheck, UserPlus, X
} from "lucide-react";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 0;
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => { fetchUsers(); }, [page, roleFilter, debouncedSearch]);

    const fetchUsers = () => {
        const filters: Record<string, any> = {};
        if (roleFilter) filters.role = roleFilter;
        getUsers(page, 10, debouncedSearch, filters).then((res) => {
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalUsers(res.data.totalElements);
        });
    };

    const handleEditConfirm = async (updated: User) => {
        if (!userToEdit) return;
        try {
            await updateUser(userToEdit.id, { role: updated.role, active: updated.active });
            setShowEditModal(false);
            toast.success(`${userToEdit.username} updated successfully`);
            fetchUsers();
        } catch {
            toast.error("Failed to update user");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        setShowDeleteModal(false);
        try {
            await deleteUserById(userToDelete.id);
            toast.success(`${userToDelete.username} removed`);
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        } catch {
            toast.error("Failed to delete user");
        } finally {
            setUserToDelete(null);
        }
    };

    const avatarColors = [
        "from-purple-400 to-purple-600",
        "from-blue-400 to-blue-600",
        "from-emerald-400 to-emerald-600",
        "from-amber-400 to-amber-600",
        "from-rose-400 to-rose-600",
    ];
    const getAvatarColor = (name: string) =>
        avatarColors[name.charCodeAt(0) % avatarColors.length];

    const activeUsers = users.filter(u => u.active).length;

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Edit Modal */}
            {showEditModal && userToEdit && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Edit user</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{userToEdit.username}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                                    value={userToEdit.role}
                                    onChange={e => setUserToEdit({ ...userToEdit, role: e.target.value as User["role"] })}
                                >
                                    <option value="ROLE_USER">User</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Active account</p>
                                    <p className="text-xs text-gray-500 mt-0.5">User can log in and access the platform</p>
                                </div>
                                <button
                                    onClick={() => setUserToEdit({ ...userToEdit, active: !userToEdit.active })}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${userToEdit.active ? "bg-purple-500" : "bg-gray-300"}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${userToEdit.active ? "translate-x-5" : "translate-x-0"}`} />
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3">
                            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => handleEditConfirm(userToEdit)} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={20} className="text-rose-600" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete user?</h3>
                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{userToDelete.username}</span> will be permanently removed.
                            </p>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
                <p className="text-sm text-gray-500 mt-1">Manage accounts, roles and access.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total users", value: totalUsers, icon: <UsersIcon size={18} />, color: "from-blue-400 to-blue-600", badge: "+12.5% vs last month" },
                    { label: "Active users", value: activeUsers, icon: <UserCheck size={18} />, color: "from-emerald-400 to-emerald-600", badge: "on this page" },
                    { label: "New today", value: 47, icon: <UserPlus size={18} />, color: "from-purple-400 to-purple-600", badge: "+23.1% vs yesterday" },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 leading-tight">{stat.value.toLocaleString()}</p>
                            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-md">{stat.badge}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Toolbar */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                        <h2 className="text-base font-semibold text-gray-800 whitespace-nowrap">All users</h2>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {totalUsers.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search users…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent w-full sm:w-56 transition-all"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                        >
                            <option value="">All roles</option>
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_USER">User</option>
                        </select>
                        <button
                            onClick={() => exportUsersToExcel(users)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {["#", "User", "Role", "Status", "Joined", "Actions"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider first:pl-5">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <UsersIcon size={20} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">No users found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="pl-5 pr-4 py-3.5 text-xs font-mono text-gray-400">{user.id}</td>
                                    <td className="pl-5 pr-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(user.username)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{user.username}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${user.role === "ROLE_ADMIN"
                                                ? "bg-purple-50 text-purple-700 ring-1 ring-purple-100"
                                                : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${user.active
                                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                                : "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.active ? "bg-emerald-500" : "bg-rose-400"}`} />
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => { setUserToEdit(user); setShowEditModal(true); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-700">{page + 1}</span> of{" "}
                        <span className="font-medium text-gray-700">{totalPages}</span>
                        <span className="text-gray-400 ml-2">· {totalUsers.toLocaleString()} total</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled={page === 0}
                            onClick={() => setParams({ page: String(page - 1) })}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={15} /> Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setParams({ page: String(i) })}
                                className={`w-8 h-8 text-sm font-medium rounded-xl transition-all ${page === i
                                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setParams({ page: String(page + 1) })}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}