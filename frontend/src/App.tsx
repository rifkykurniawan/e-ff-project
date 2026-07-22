import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import { LogOut, Wallet } from "lucide-react";
import "./App.css";

const queryClient = new QueryClient();

// Dashboard Placeholder Page to verify successful login
const DashboardPlaceholder: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-500">
          <Wallet className="h-6 w-6" />
          <span className="font-bold text-lg text-white">Family Finance</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Logged in as: <strong className="text-zinc-200">{user?.email}</strong></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Welcome to Family Finance!</h1>
        <p className="text-zinc-400 max-w-md">
          Authentication is fully functional. The backend database session is connected, and the frontend JWT session state is active.
        </p>
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPlaceholder />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
