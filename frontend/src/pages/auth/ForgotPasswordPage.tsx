import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForgotPassword } from "@/hooks/useAuth";

const schema = z.object({ email: z.string().email("E-mail inválido.") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const forgot = useForgotPassword();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    forgot.mutate(data.email, { onSuccess: () => setSent(true) });
  };

  if (sent) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-10 pb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary-100 rounded-full p-4">
              <MailCheck className="text-primary-600" size={32} />
            </div>
          </div>
          <h2 className="text-xl font-semibold">E-mail enviado!</h2>
          <p className="text-sm text-muted-foreground">
            Se <strong>{getValues("email")}</strong> está cadastrado, você receberá um link para redefinir a senha em breve.
          </p>
          <Link to="/auth/login">
            <Button variant="outline" className="w-full mt-2">Voltar ao login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Esqueci a senha</CardTitle>
        <CardDescription>
          Informe seu e-mail e enviaremos um link para redefinir a senha.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@exemplo.com" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" loading={forgot.isPending}>
            Enviar link de recuperação
          </Button>
        </form>
        <Link to="/auth/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground justify-center">
          <ArrowLeft size={14} /> Voltar ao login
        </Link>
      </CardContent>
    </Card>
  );
}
