import { supabase } from "./supabaseClient";
import type { LoginCredentials, TokenResponse, UserResponse, EnvelopeResponse } from "../types/auth";

export const authService = {
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

      return {
        success: true,
        message: "Login successful",
        data: {
          access_token: data.session.access_token,
          token_type: "bearer",
          user: {
            id: data.user.id,
            email: data.user.email || "",
            first_name: data.user.user_metadata?.first_name || "Keluarga",
            last_name: data.user.user_metadata?.last_name || "",
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
      return {
        success: true,
        message: "Session retrieved successfully",
        data: {
          id: user.id,
          email: user.email || "",
          first_name: user.user_metadata?.first_name || "Keluarga",
          last_name: user.user_metadata?.last_name || "",
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
