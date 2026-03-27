import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPassword } from "@/hooks/useAuth";

const schema = z
  .object({
    new_password: z
      .string()
      .min(8, "Mínimo 8 caracteres.")
      .regex(/[A-Za-z]/, "Deve conter letras.")
      .regex(/\d/, "Deve conter números."),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "As senhas não coincidem.",
    path: ["confirm_password"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPw, setShowPw] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const reset = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ new_password }: FormData) => {
    reset.mutate({ token, new_password });
  };

  const errorMessage =
    reset.error && "response" in reset.error
      ? (reset.error as any).response?.data?.detail ?? "Erro ao redefinir senha."
      : null;

  if (!token) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-10 pb-8 text-center space-y-4">
          <AlertTriangle className="mx-auto text-yellow-500" size={40} />
          <p className="text-sm text-muted-foreground">Link inválido ou expirado.</p>
          <Link to="/auth/forgot-password">
            <Button variant="outline" className="w-full">Solicitar novo link</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Nova senha</CardTitle>
        <CardDescription>Escolha uma senha forte para sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new_password">Nova senha</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPw ? "text" : "password"}
                placeholder="Mín. 8 caracteres"
                {...register("new_password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPw((p) => !p)}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.new_password && <p className="text-xs text-red-500">{errors.new_password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirmar senha</Label>
            <Input
              id="confirm_password"
              type={showPw ? "text" : "password"}
              placeholder="Repita a senha"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500">{errors.confirm_password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" size="lg" loading={reset.isPending}>
            Redefinir senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
