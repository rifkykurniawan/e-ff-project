import { supabase } from "./supabaseClient";
import type { LoginCredentials, SignUpCredentials, TokenResponse, UserResponse, EnvelopeResponse } from "../types/auth";

export const authService = {
  signUp: async (credentials: SignUpCredentials): Promise<EnvelopeResponse<UserResponse>> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          data: null as any,
          errors: { message: [error.message] },
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: "Failed to create user account.",
          data: null as any,
        };
      }

      // Automatically sign out because signup creates a session, but they need admin approval first
      await supabase.auth.signOut();

      return {
        success: true,
        message: "Registration successful. Your account is pending administrator approval.",
        data: {
          id: data.user.id,
          email: data.user.email || "",
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          email_confirmed: !!data.user.email_confirmed_at,
          is_verified: false,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred",
        data: null as any,
      };
    }
  },

  login: async (credentials: LoginCredentials): Promise<EnvelopeResponse<TokenResponse>> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          data: null as any,
          errors: { message: [error.message] },
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          message: "Failed to establish a session.",
          data: null as any,
        };
      }

      const { data: profile } = await supabase
        .from("users")
        .select("first_name, last_name, is_verified")
        .eq("id", data.user.id)
        .single();

      if (!profile || !profile.is_verified) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: "Your account is pending administrator approval.",
          data: null as any,
          errors: { message: ["Your account is pending administrator approval."] },
        };
      }

      return {
        success: true,
        message: "Login successful",
        data: {
          access_token: data.session.access_token,
          token_type: "bearer",
          user: {
            id: data.user.id,
            email: data.user.email || "",
            first_name: profile.first_name,
            last_name: profile.last_name,
            email_confirmed: !!data.user.email_confirmed_at,
            is_verified: profile.is_verified,
          },
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred",
        data: null as any,
      };
    }
  },

  getMe: async (): Promise<EnvelopeResponse<UserResponse>> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return {
          success: false,
          message: error.message,
          data: null as any,
        };
      }

      if (!data.session || !data.session.user) {
        return {
          success: false,
          message: "No active session found.",
          data: null as any,
        };
      }

      const user = data.session.user;
      
      const { data: profile } = await supabase
        .from("users")
        .select("first_name, last_name, is_verified")
        .eq("id", user.id)
        .single();

      if (!profile || !profile.is_verified) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: "Your account is pending administrator approval.",
          data: null as any,
        };
      }

      return {
        success: true,
        message: "Session retrieved successfully",
        data: {
          id: user.id,
          email: user.email || "",
          first_name: profile.first_name,
          last_name: profile.last_name,
          email_confirmed: !!user.email_confirmed_at,
          is_verified: profile.is_verified,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred",
        data: null as any,
      };
    }
  },

  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  }
};
