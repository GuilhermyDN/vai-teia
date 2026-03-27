import {
  Instagram,
  Facebook,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Unlink,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSocialAccounts, useDisconnectAccount } from "@/hooks/useSocial";
import { useAuthStore } from "@/store/auth.store";
import type { Platform, SocialAccount } from "@/types";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.2 8.2 0 004.79 1.53V7.04a4.85 4.85 0 01-1.02-.35z" />
    </svg>
  );
}

type PlatformConfig = {
  id: Platform;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  border: string;
  oauthPath: string;
};

const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Agende posts, Reels e Stories. Gerencie comentários e DMs.",
    icon: Instagram as unknown as React.ComponentType<{ size?: number; className?: string }>,
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    oauthPath: "/api/v1/social/meta/auth?platform=instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Publique em páginas, responda comentários e mensagens.",
    icon: Facebook as unknown as React.ComponentType<{ size?: number; className?: string }>,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    oauthPath: "/api/v1/social/meta/auth?platform=facebook",
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Programe publicações de vídeo e gerencie comentários.",
    icon: TikTokIcon,
    color: "text-slate-900",
    bg: "bg-slate-50",
    border: "border-slate-200",
    oauthPath: "/api/v1/social/tiktok/auth",
  },
];

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function ConnectedCard({ account }: { account: SocialAccount }) {
  const platform = PLATFORMS.find((p) => p.id === account.platform)!;
  const Icon = platform.icon;
  const disconnect = useDisconnectAccount();

  return (
    <Card className={`border ${platform.border}`}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${platform.bg}`}>
            <Icon size={20} className={platform.color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{account.display_name}</p>
            <p className="text-xs text-muted-foreground truncate">@{account.username}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-xs">
              {formatFollowers(account.followers_count)} seguidores
            </Badge>
            <CheckCircle2 className="text-primary-500" size={16} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1.5"
            onClick={() =>
              window.open(`https://${account.platform}.com/${account.username}`, "_blank")
            }
          >
            <ExternalLink size={13} /> Ver perfil
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 text-destructive hover:text-destructive"
            disabled={disconnect.isPending}
            onClick={() => disconnect.mutate(account.id)}
          >
            {disconnect.isPending ? <Loader2 size={13} className="animate-spin" /> : <Unlink size={13} />}{" "}
            Desconectar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AvailableCard({ platform }: { platform: PlatformConfig }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const Icon = platform.icon;

  function handleConnect() {
    const sep = platform.oauthPath.includes("?") ? "&" : "?";
    window.location.href = `${platform.oauthPath}${sep}token=${accessToken}`;
  }

  return (
    <Card className="border border-dashed hover:border-solid hover:shadow-sm transition-all">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${platform.bg}`}>
            <Icon size={20} className={platform.color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{platform.name}</p>
            <p className="text-xs text-muted-foreground leading-snug">{platform.description}</p>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          variant="outline"
          size="sm"
          onClick={handleConnect}
        >
          Conectar {platform.name}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SocialPage() {
  const { data: accounts, isLoading, isError, refetch } = useSocialAccounts();
  const [searchParams, setSearchParams] = useSearchParams();
  const connected = searchParams.get("connected");
  const error = searchParams.get("error");

  useEffect(() => {
    if (connected || error) {
      if (connected) refetch();
      // Limpa os params da URL sem recarregar
      setSearchParams({}, { replace: true });
    }
  }, [connected, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const connectedIds = new Set((accounts ?? []).map((a) => a.platform));
  const available = PLATFORMS.filter((p) => !connectedIds.has(p.id));

  const connectedName = PLATFORMS.find((p) => p.id === connected)?.name ?? connected;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Feedback de OAuth */}
      {connected && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <span><strong>{connectedName}</strong> conectado com sucesso!</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
          <XCircle size={16} className="text-red-600 shrink-0" />
          <span>Erro ao conectar a rede social. Tente novamente.</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Redes sociais</h1>
          <p className="text-muted-foreground mt-1">
            Conecte suas contas para agendar posts e gerenciar mensagens.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw size={14} /> Atualizar
        </Button>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
        <div className="text-sm">
          <p className="font-medium text-blue-800">Sobre as permissões</p>
          <p className="text-blue-700">
            Solicitamos apenas as permissões necessárias para publicar conteúdo e ler mensagens.
            Nunca publicamos sem sua aprovação.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-primary-500" size={28} />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
            <p className="text-sm">Erro ao carregar contas. Tente novamente.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {(accounts ?? []).length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Contas conectadas ({accounts!.length})
              </h2>
              <div className="grid gap-3">
                {accounts!.map((account) => (
                  <ConnectedCard key={account.id} account={account} />
                ))}
              </div>
            </section>
          )}

          {available.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {(accounts ?? []).length > 0 ? "Adicionar mais contas" : "Conectar uma conta"}
              </h2>
              <div className="grid gap-3">
                {available.map((platform) => (
                  <AvailableCard key={platform.id} platform={platform} />
                ))}
              </div>
            </section>
          )}

          {available.length === 0 && (
            <Card className="border-primary-200 bg-primary-50/30">
              <CardContent className="pt-6 pb-6 flex flex-col items-center gap-2 text-center">
                <CheckCircle2 className="text-primary-500" size={32} />
                <p className="font-semibold">Todas as redes conectadas!</p>
                <p className="text-sm text-muted-foreground">
                  Instagram, Facebook e TikTok estão vinculados à sua conta.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
