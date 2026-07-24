import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, Tags, LogOut, ArrowLeftRight, PieChart, PiggyBank, Sun, Moon, Eye, EyeOff, BarChart3 } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useTheme } from "../components/ThemeContext";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showBalances, setShowBalances] = useState<boolean>(() => {
    const saved = localStorage.getItem("show_balances");
    return saved !== "false";
  });

  const toggleShowBalances = () => {
    setShowBalances((prev) => {
      const next = !prev;
      localStorage.setItem("show_balances", String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Accounts", path: "/accounts", icon: Wallet },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
    { name: "Budgets", path: "/budgets", icon: PieChart },
    { name: "Saving Goals", path: "/saving-goals", icon: PiggyBank },
    { name: "Reports", path: "/reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row">
      {/* Sidebar Navigation */}
      <nav className="sm:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                <Wallet className="h-5 w-5" />
              </div>
              Finance
            </h1>
          </div>
          <ul className="px-3 space-y-1 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Area + Header */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Consistent Top Bar Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
          {/* Logo / Mobile Title */}
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-500 sm:hidden">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Finance</span>
          </div>
          <div className="hidden sm:block"></div> {/* Spacer on desktop */}

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-xs text-zinc-500">{user?.email}</span>
            </div>

            {/* Hide/Show Balances Toggle */}
            <button
              onClick={toggleShowBalances}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              title={showBalances ? "Hide Balances" : "Show Balances"}
              data-testid="balance-visibility-toggle"
            >
              {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>

            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              title="Change Theme"
              data-testid="theme-toggle-button"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-3 py-1.5 text-sm font-medium transition-colors text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 cursor-pointer"
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ showBalances }} />
          </div>
        </main>
      </div>
    </div>
  );
}
