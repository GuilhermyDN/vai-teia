import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => login.mutate(data);

  const errorMessage =
    login.error && "response" in login.error
      ? (login.error as { response?: { data?: { detail?: string } } }).response?.data?.detail ?? "Erro ao fazer login."
      : null;

  return (
    <div className="w-full">
      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[1.6rem] font-bold text-gray-900 leading-tight">Entrar na conta</h1>
          <p className="text-[0.875rem] text-gray-500 mt-1">Bem-vindo de volta ao Vaiteia 👋</p>
        </div>

        {/* Alerts */}
        {resetSuccess && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm mb-5">
            <CheckCircle2 size={15} className="shrink-0" />
            Senha redefinida! Entre com a nova senha.
          </div>
        )}
        {errorMessage && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
            <AlertCircle size={15} className="shrink-0" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="voce@exemplo.com"
              autoComplete="email"
              className={`
                w-full h-11 px-3.5 rounded-xl border bg-gray-50 text-sm text-gray-900
                placeholder:text-gray-400 outline-none transition-all
                focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100
                ${errors.email ? "border-red-300 bg-red-50/30" : "border-gray-200"}
              `}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Esqueci a senha
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`
                  w-full h-11 px-3.5 pr-11 rounded-xl border bg-gray-50 text-sm text-gray-900
                  placeholder:text-gray-400 outline-none transition-all
                  focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100
                  ${errors.password ? "border-red-300 bg-red-50/30" : "border-gray-200"}
                `}
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={login.isPending}
            className="
              w-full h-11 rounded-xl font-semibold text-sm text-white mt-1
              bg-gradient-to-r from-primary-500 to-primary-600
              hover:from-primary-600 hover:to-primary-700
              active:scale-[0.98] transition-all duration-150
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-md shadow-primary-200/50
            "
          >
            {login.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Entrando...
              </span>
            ) : "Entrar"}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
              ou continue com
            </span>
          </div>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => (window.location.href = "/api/v1/auth/google")}
          className="
            w-full h-11 rounded-xl border border-gray-200 bg-white
            hover:bg-gray-50 active:bg-gray-100
            transition-colors flex items-center justify-center gap-2.5
            text-sm font-medium text-gray-700 shadow-sm
          "
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-gray-500 mt-5">
        Não tem conta?{" "}
        <Link to="/auth/register" className="text-primary-600 font-semibold hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </div>
  );
}
