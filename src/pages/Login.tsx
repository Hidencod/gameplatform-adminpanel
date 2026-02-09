import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import {useNavigate } from "react-router-dom";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, SetError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {login:authLogin} = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        SetError("");
        setIsLoading(true);
        try {
            const response = await login({ username, password });
            authLogin(response.token, response.role);
            //window.location.href = response.role === "ROLE_ADMIN" ? "/dashboard" : "/"; 
            navigate(
                response.role === "ROLE_ADMIN"?"/dashboard":"/",
                {replace:true}
            )
        } catch (err) {
            SetError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
            <div className="w-full max-w-md px-6">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    {/* Logo or Icon Area */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Admin Login</h1>
                    <p className="text-center text-gray-500 text-sm mb-6">Enter your credentials to access the dashboard</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <Input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={isLoading || !username || !password}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    © 2024 Your Company. All rights reserved.
                </p>
            </div>
        </div>
    )
}