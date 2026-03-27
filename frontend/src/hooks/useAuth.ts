import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { TokenResponse, User } from "@/types";

// ── Busca o usuário autenticado ──────────────────────────────────────────────
export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<User>("/auth/me");
      setUser(data);
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });
}

// ── Login ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post<TokenResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    },
  });
}

// ── Registro ──────────────────────────────────────────────────────────────────
export function useRegister() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: { name: string; email: string; password: string }) => {
      const { data } = await api.post<TokenResponse>("/auth/register", payload);
      return data;
    },
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    logout();
    queryClient.clear();
    navigate("/auth/login");
  };
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      await api.post("/auth/forgot-password", { email });
    },
  });
}

// ── Reset Password ────────────────────────────────────────────────────────────
export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: { token: string; new_password: string }) => {
      await api.post("/auth/reset-password", payload);
    },
    onSuccess: () => {
      navigate("/auth/login?reset=success");
    },
  });
}
