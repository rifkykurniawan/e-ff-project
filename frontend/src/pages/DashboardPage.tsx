import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  TrendingUp,
  Target,
  LogOut,
  X,
  Plus,
  Minus,
  Sparkles,
  PieChart,
  Sun,
  Moon
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: dashboardData, isLoading, isError, refetch } = useDashboard();
  const navigate = useNavigate();

  // Quick Action Modal State
  const [activeModal, setActiveModal] = useState<"income" | "expense" | "transfer" | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-center items-center gap-4 transition-colors duration-200">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Memuat dasbor keluarga...</p>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-center items-center gap-4 transition-colors duration-200">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center max-w-md">
          <p className="text-red-400 font-semibold mb-2">Gagal Memuat Dasbor</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Tidak dapat mengambil data dasbor. Silakan periksa apakah layanan backend sedang berjalan.
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 transition-colors text-white"
          >
            Coba Hubungkan Kembali
          </button>
        </div>
      </div>
    );
  }

  // Pie/Donut Chart calculations
  const totalBreakdown = dashboardData.total_balance + dashboardData.income_this_month + dashboardData.expense_this_month;
  const balancePercent = totalBreakdown > 0 ? (dashboardData.total_balance / totalBreakdown) * 100 : 0;
  const incomePercent = totalBreakdown > 0 ? (dashboardData.income_this_month / totalBreakdown) * 100 : 0;
  const expensePercent = totalBreakdown > 0 ? (dashboardData.expense_this_month / totalBreakdown) * 100 : 0;

  const r = 38;
  const circ = 2 * Math.PI * r; // ~238.76

  const balanceStrokeLength = (balancePercent * circ) / 100;
  const incomeStrokeLength = (incomePercent * circ) / 100;
  const expenseStrokeLength = (expensePercent * circ) / 100;

  const balanceOffset = 0;
  const incomeOffset = -balanceStrokeLength;
  const expenseOffset = -(balanceStrokeLength + incomeStrokeLength);

  // Helper to translate Transaction Type visually
  const formatTxType = (type: string) => {
    switch (type) {
      case "Income":
        return "Pendapatan";
      case "Expense":
        return "Pengeluaran";
      case "Transfer":
        return "Transfer";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
        <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-500">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Finance</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-zinc-500">{user?.email}</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700"
            title="Ubah Tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-3 py-1.5 text-sm font-medium transition-colors text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-md relative overflow-hidden transition-colors duration-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Halo, {user?.first_name || "Keluarga"} 👋
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
              Berikut adalah ringkasan keuangan Anda bulan ini.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveModal("income")}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Catat Pendapatan
            </button>
            <button
              onClick={() => setActiveModal("expense")}
              className="flex items-center gap-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-white transition-all active:scale-95 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
            >
              <Minus className="h-4 w-4" /> Catat Pengeluaran
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Saldo</span>
              <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {formatCurrency(dashboardData.total_balance)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Di seluruh akun</p>
            </div>
          </div>

          {/* Income This Month */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pendapatan Bulan Ini</span>
              <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatCurrency(dashboardData.income_this_month)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Dicatat sejak awal bulan</p>
            </div>
          </div>

          {/* Expense This Month */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pengeluaran Bulan Ini</span>
              <div className="bg-rose-500/10 p-2 rounded-lg text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-rose-650 dark:text-rose-400">
                {formatCurrency(dashboardData.expense_this_month)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Dicatat sejak awal bulan</p>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Saldo Bersih</span>
              <div className="bg-violet-500/10 p-2 rounded-lg text-violet-600 dark:text-violet-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold tracking-tight ${dashboardData.net_balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {formatCurrency(dashboardData.net_balance)}
              </p>
              <p className="text-xs text-zinc-450 dark:text-zinc-500">Pendapatan dikurangi pengeluaran</p>
            </div>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Area (Budget & Transactions) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Allocation Chart Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-200">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                <h2 className="text-lg font-bold tracking-tight">Rincian Alokasi Keuangan</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                {/* SVG Donut */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r={r}
                      fill="transparent"
                      stroke="#e4e4e7"
                      className="dark:stroke-zinc-800"
                      strokeWidth="10"
                    />
                    {balancePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        className="stroke-blue-500"
                        strokeWidth="10"
                        strokeDasharray={`${balanceStrokeLength} ${circ}`}
                        strokeDashoffset={balanceOffset}
                        strokeLinecap="round"
                      />
                    )}
                    {incomePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        className="stroke-emerald-500"
                        strokeWidth="10"
                        strokeDasharray={`${incomeStrokeLength} ${circ}`}
                        strokeDashoffset={incomeOffset}
                        strokeLinecap="round"
                      />
                    )}
                    {expensePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={r}
                        fill="transparent"
                        className="stroke-rose-500"
                        strokeWidth="10"
                        strokeDasharray={`${expenseStrokeLength} ${circ}`}
                        strokeDashoffset={expenseOffset}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center p-4">
                    <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-bold uppercase tracking-widest">Nilai Bersih</span>
                    <span className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight mt-0.5">
                      {formatCurrency(dashboardData.net_balance)}
                    </span>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex-1 space-y-4 w-full sm:max-w-xs">
                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Total Saldo</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{formatCurrency(dashboardData.total_balance)}</p>
                      <p className="text-[10px] text-zinc-500">{balancePercent.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pendapatan</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(dashboardData.income_this_month)}</p>
                      <p className="text-[10px] text-zinc-500">{incomePercent.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 transition-colors duration-200">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pengeluaran</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{formatCurrency(dashboardData.expense_this_month)}</p>
                      <p className="text-[10px] text-zinc-500">{expensePercent.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Ringkasan Anggaran</h2>
                </div>
                <span className="text-xs text-zinc-550 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full font-medium transition-colors duration-200">Bulan Ini</span>
              </div>

              <div className="space-y-4">
                {dashboardData.budget_summary.length === 0 ? (
                  <p className="text-sm text-zinc-550 dark:text-zinc-500 text-center py-4">Belum ada anggaran bulanan yang dikonfigurasi.</p>
                ) : (
                  dashboardData.budget_summary.map((budget, idx) => {
                    const percent = Math.min((budget.actual / budget.planned) * 100, 100);
                    const isOver = budget.remaining < 0;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">{budget.category_name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400">
                            {formatCurrency(budget.actual)} <span className="text-zinc-400 dark:text-zinc-650">/ {formatCurrency(budget.planned)}</span>
                          </span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-rose-500" : "bg-emerald-555"}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          {isOver ? (
                            <span className="text-rose-600 dark:text-rose-400 font-medium">Melebihi anggaran sebesar {formatCurrency(Math.abs(budget.remaining))}</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Tersisa {formatCurrency(budget.remaining)}</span>
                          )}
                          <span className="text-zinc-500">{percent.toFixed(0)}% terpakai</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <ArrowLeftRight className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Transaksi Terkini</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase font-semibold">
                      <th className="py-3 px-1">Deskripsi</th>
                      <th className="py-3 px-1">Tipe</th>
                      <th className="py-3 px-1">Tanggal</th>
                      <th className="py-3 px-1 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 text-sm">
                    {dashboardData.recent_transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-zinc-500">
                          Transaksi tidak ditemukan.
                        </td>
                      </tr>
                    ) : (
                      dashboardData.recent_transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3.5 px-1">
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{tx.description}</p>
                          </td>
                          <td className="py-3.5 px-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                tx.type === "Income"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : tx.type === "Expense"
                                  ? "bg-rose-500/10 text-rose-605 dark:text-rose-400"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {formatTxType(tx.type)}
                            </span>
                          </td>
                          <td className="py-3.5 px-1 text-zinc-500 dark:text-zinc-400 text-xs">
                            {new Date(tx.date).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </td>
                          <td className={`py-3.5 px-1 text-right font-semibold ${
                            tx.type === "Income"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : tx.type === "Expense"
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}>
                            {tx.type === "Expense" ? "-" : tx.type === "Income" ? "+" : ""}
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Area (Goals & Quick Actions) */}
          <div className="space-y-6">
            {/* Saving Goals Summary Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                  <h2 className="text-lg font-bold tracking-tight">Tujuan Tabungan</h2>
                </div>
              </div>

              <div className="space-y-4">
                {dashboardData.saving_goals.length === 0 ? (
                  <p className="text-sm text-zinc-550 dark:text-zinc-500 text-center py-4">Belum ada tujuan tabungan yang ditentukan.</p>
                ) : (
                  dashboardData.saving_goals.map((goal, idx) => (
                    <div key={idx} className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 transition-colors duration-200">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{goal.name}</span>
                        <span className="text-xs bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          {goal.progress_percentage}%
                        </span>
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-200">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-200">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                <h2 className="text-lg font-bold tracking-tight">Tindakan Cepat</h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => setActiveModal("income")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-3.5 text-sm font-medium transition-all text-left text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:scale-[0.99] cursor-pointer"
                >
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-500">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Catat Pendapatan</p>
                    <p className="text-xs text-zinc-500">Tambahkan pemasukan kas atau gaji</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("expense")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-3.5 text-sm font-medium transition-all text-left text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:scale-[0.99] cursor-pointer"
                >
                  <div className="bg-rose-500/10 p-2 rounded-lg text-rose-600 dark:text-rose-500">
                    <Minus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Catat Pengeluaran</p>
                    <p className="text-xs text-zinc-500">Tambahkan pengeluaran atau pembayaran</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("transfer")}
                  className="flex items-center gap-3 w-full rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-3.5 text-sm font-medium transition-all text-left text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 active:scale-[0.99] cursor-pointer"
                >
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-500">
                    <ArrowLeftRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Transfer Uang</p>
                    <p className="text-xs text-zinc-500">Pindahkan dana antar rekening</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Action Modal Placeholder */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-up transition-colors duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-colors duration-200">
              <h3 className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-2">
                {activeModal === "income" && <Plus className="h-4 w-4 text-emerald-500" />}
                {activeModal === "expense" && <Minus className="h-4 w-4 text-rose-500" />}
                {activeModal === "transfer" && <ArrowLeftRight className="h-4 w-4 text-blue-500" />}
                Catat {activeModal === "income" ? "Pendapatan" : activeModal === "expense" ? "Pengeluaran" : "Transfer"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Anda telah memicu formulir untuk <strong className="text-emerald-600 dark:text-emerald-400 capitalize">{activeModal === "income" ? "Pendapatan" : activeModal === "expense" ? "Pengeluaran" : "Transfer"}</strong>.
              </p>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 transition-colors duration-200">
                <span className="text-xs font-semibold text-emerald-650 dark:text-emerald-500 uppercase tracking-widest block">Segera Hadir</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Formulir input transaksi interaktif dan perhitungan saldo dinamis akan diimplementasikan pada fase fitur berikutnya (Milestone 3: Buku Besar Transaksi).
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-sm text-zinc-800 dark:text-white font-semibold py-2.5 rounded-xl transition-all border border-zinc-200 dark:border-zinc-700/60 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
