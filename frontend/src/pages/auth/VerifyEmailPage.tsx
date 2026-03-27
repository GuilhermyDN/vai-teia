import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    api.post("/auth/verify-email", { token })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-12 pb-8 text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto animate-spin text-primary-500" size={40} />
            <p className="text-muted-foreground text-sm">Verificando seu e-mail...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto text-primary-500" size={48} />
            <h2 className="text-xl font-semibold">E-mail verificado!</h2>
            <p className="text-sm text-muted-foreground">Sua conta está confirmada. Você já pode usar o Vaiteia.</p>
            <Link to="/dashboard">
              <Button className="w-full mt-2">Ir para o dashboard</Button>
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500" size={48} />
            <h2 className="text-xl font-semibold">Link inválido ou expirado</h2>
            <p className="text-sm text-muted-foreground">Faça login e solicite um novo e-mail de verificação.</p>
            <Link to="/auth/login">
              <Button variant="outline" className="w-full mt-2">Voltar ao login</Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
