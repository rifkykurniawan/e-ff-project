import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Wallet, Sun, Moon, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useTheme } from "../components/ThemeContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    setErrorMsg(null);
    try {
      await login(data);
      navigate("/");
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f4f9f6] dark:bg-[#05160E] text-zinc-800 dark:text-zinc-100 flex flex-col transition-colors duration-300 selection:bg-[#3cd395] selection:text-black">
      {/* Background Image with Transparency */}
      <div 
        className="fixed inset-0 bg-[url('/imageBackground.svg')] bg-contain bg-no-repeat bg-center opacity-25 dark:opacity-15 pointer-events-none"
      />

      {/* Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#cce8db]/60 dark:border-[#123022]/40">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3cd395]/10 text-[#3cd395]">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#0a271c] dark:text-white">E-Finance</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme/Dark Switcher Capsule */}
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-button"
            className="flex items-center gap-1.5 bg-[#e6f4ed] hover:bg-[#d2ebd9] dark:bg-[#0e271c] dark:hover:bg-[#153828] border border-[#cce8db] dark:border-[#1a4230] hover:border-[#b4e0c4] dark:hover:border-[#22573f] rounded-full px-3 py-1 text-xs font-semibold text-[#0a271c] dark:text-zinc-300 hover:text-[#061c13] dark:hover:text-white transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Text */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#248d61] dark:text-[#3cd395]">E-FINANCE APP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[#0a271c] dark:text-white leading-[1.15] tracking-tight">
            Master Your Money, <br />
            <span className="text-[#248d61] dark:text-[#3cd395]">Not Your Financial Stress.</span>
          </h1>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-[#cce8db]/60 dark:border-[#123022]/40 max-w-lg">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#248d61] dark:text-[#3cd395] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#0a271c] dark:text-white text-sm">100% Private</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Relax! Your data never leaves your instance.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#248d61] dark:text-[#3cd395] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#0a271c] dark:text-white text-sm">Smart Budgets</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Track and manage your spending habits effortlessly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Login Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-2xl border border-[#cce8db] dark:border-[#1a4230] bg-white/80 dark:bg-[#0a1e15]/60 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
            {/* Background ambient glow inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#3cd395]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0a271c] dark:text-white tracking-tight">Welcome Back</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to manage your finances</p>
              </div>

              {errorMsg && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-650 dark:text-red-400 mb-6 animate-pulse">
                  {errorMsg}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-550 dark:text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register("email")}
                    data-testid="login-email-input"
                    className={`block w-full rounded-lg border bg-white dark:bg-[#05160E]/80 border-[#cce8db] dark:border-[#1a4230] px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#248d61] dark:focus:border-[#3cd395] focus:outline-none focus:ring-1 focus:ring-[#3cd395]/40 transition-all ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="example@mail.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                      Password
                    </label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    data-testid="login-password-input"
                    className={`block w-full rounded-lg border bg-white dark:bg-[#05160E]/80 border-[#cce8db] dark:border-[#1a4230] px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-[#248d61] dark:focus:border-[#3cd395] focus:outline-none focus:ring-1 focus:ring-[#3cd395]/40 transition-all ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="login-submit-button"
                    className="flex w-full justify-center items-center gap-2 rounded-lg bg-[#3cd395] hover:bg-[#4be4a4] px-4 py-2.5 text-sm font-semibold text-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#3cd395] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0a1e15] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center text-xs text-zinc-500 dark:text-zinc-450 mt-6 pt-4 border-t border-[#cce8db]/60 dark:border-[#123022]/40">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-semibold text-[#248d61] dark:text-[#3cd395] hover:text-[#2fae7a] dark:hover:text-[#4be4a4] transition-colors">
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 mt-auto flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 border-t border-[#cce8db]/40 dark:border-[#123022]/20">
        <p>&copy; {new Date().getFullYear()} E-Finance by rkDEV. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#248d61] dark:text-[#3cd395]" /> Built for user privacy.
        </p>
      </footer>
    </div>
  );
};
