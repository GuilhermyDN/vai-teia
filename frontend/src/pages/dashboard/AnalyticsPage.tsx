import { Instagram, Facebook, Users, BarChart2, FileText, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";
import type { Platform } from "@/types";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.2 8.2 0 004.79 1.53V7.04a4.85 4.85 0 01-1.02-.35z" />
    </svg>
  );
}

const PLATFORM_META: Record<Platform, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  instagram: { label: "Instagram", icon: Instagram as unknown as React.ComponentType<{ size?: number; className?: string }>, color: "text-pink-500", bg: "bg-pink-50" },
  facebook: { label: "Facebook", icon: Facebook as unknown as React.ComponentType<{ size?: number; className?: string }>, color: "text-blue-600", bg: "bg-blue-50" },
  tiktok: { label: "TikTok", icon: TikTokIcon, color: "text-slate-900", bg: "bg-slate-100" },
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAnalyticsOverview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o desempenho das suas redes sociais.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw size={14} /> Atualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={28} />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-10 pb-10 text-center text-muted-foreground">
            <p className="text-sm">Erro ao carregar dados. Tente novamente.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : !data || data.platforms.length === 0 ? (
        /* ── Estado vazio: sem contas conectadas ── */
        <Card className="border-dashed border-2">
          <CardContent className="pt-14 pb-14 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <BarChart2 size={40} className="text-primary-200" />
            <p className="font-medium">Nenhum dado disponível ainda</p>
            <p className="text-sm max-w-sm">
              Conecte ao menos uma conta social para começar a ver métricas de desempenho.
            </p>
            <Button className="mt-2" onClick={() => (window.location.href = "/dashboard/social")}>
              Conectar conta social
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-full p-2 bg-blue-50">
                    <Users size={18} className="text-blue-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-3">{formatNum(data.total_followers)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Seguidores totais</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-full p-2 bg-purple-50">
                    <FileText size={18} className="text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-3">{formatNum(data.total_posts)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Posts publicados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-full p-2 bg-green-50">
                    <BarChart2 size={18} className="text-green-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-3">{data.platforms.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Redes conectadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Por plataforma */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Por plataforma
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.platforms.map((p) => {
                const meta = PLATFORM_META[p.platform] ?? {
                  label: p.platform,
                  icon: BarChart2,
                  color: "text-slate-500",
                  bg: "bg-slate-50",
                };
                const Icon = meta.icon;
                return (
                  <Card key={`${p.platform}-${p.username}`}>
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`rounded-full p-1.5 ${meta.bg}`}>
                          <Icon size={16} className={meta.color} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{meta.label}</p>
                          <p className="text-xs text-muted-foreground truncate">@{p.username}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xl font-bold">{formatNum(p.followers_count)}</p>
                          <p className="text-xs text-muted-foreground">Seguidores</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold">{p.posts_count}</p>
                          <p className="text-xs text-muted-foreground">Posts publicados</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Aviso sobre métricas avançadas */}
          <Card className="border-dashed bg-muted/30">
            <CardContent className="pt-5 pb-5 flex items-start gap-3">
              <BarChart2 size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Métricas avançadas em breve</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Alcance, impressões, taxa de engajamento e relatórios completos estarão disponíveis
                  após a integração com as APIs das redes sociais.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
