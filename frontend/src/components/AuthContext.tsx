import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { UserResponse, LoginCredentials, SignUpCredentials } from "../types/auth";
import { authService } from "../services/authService";
import { supabase } from "../services/supabaseClient";

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and listen for Supabase auth state changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for dynamic auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session && session.user) {
           const { data: profile } = await supabase
            .from("users")
            .select("first_name, last_name, is_verified")
            .eq("id", session.user.id)
            .single();
 
          if (!profile || !profile.is_verified) {
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              first_name: profile.first_name,
              last_name: profile.last_name,
              email_confirmed: !!session.user.email_confirmed_at,
              is_verified: profile.is_verified,
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auto logout after 4 hours of inactivity
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();
    const fourHours = 4 * 60 * 60 * 1000;

    const resetTimer = () => {
      lastActivity = Date.now();
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    const interval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity >= fourHours) {
        console.log("Auto-logging out due to 4 hours of inactivity.");
        logout();
      }
    }, 15000); // Check every 15 seconds

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(interval);
    };
  }, [user]);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        queryClient.clear();
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setLoading(true);
    try {
      const response = await authService.signUp(credentials);
      if (response.success && response.data) {
        queryClient.clear();
        setUser(response.data);
      } else {
        throw new Error(response.message || "Sign up failed");
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      queryClient.clear();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
