import { BrowserRouter, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import { setNavigator } from "./utils/navigation";
import { useEffect } from "react";
import "./App.css";
import DashBoardLayout from "./pages/DashBoardLayout";
import DashBoard from "./pages/DashBoard";
import Users from "./pages/Users";
import Games from "./pages/Games";
import GameUpload from "./pages/GameUpload";

function NavigatorSetup() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  return null;
}

// Simple inline pages — or move these to their own files
function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-sm">
        Go to Dashboard
      </a>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="text-8xl font-bold bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent mb-4">
        403
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-8">You don't have permission to view this page.</p>
      <a href="/login" className="px-6 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-red-600 transition-all shadow-sm">
        Back to Login
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigatorSetup />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PrivateRoute role="ROLE_ADMIN" />}>
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/games" element={<Games />} />
            <Route path="/dashboard/games/upload" element={<GameUpload />} />
          </Route>
        </Route>

        {/* 404 catch-all — must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;