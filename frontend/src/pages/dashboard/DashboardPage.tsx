import { useAuthStore } from "@/store/auth.store";
import { Calendar, Inbox, BarChart2, Link2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSocialAccounts } from "@/hooks/useSocial";
import { useScheduledPosts } from "@/hooks/useScheduler";
import { useConversations } from "@/hooks/useInbox";

const quickActions = [
  { icon: Calendar, label: "Agendar post", to: "/dashboard/scheduler", color: "bg-blue-50 text-blue-600" },
  { icon: Inbox, label: "Ver inbox", to: "/dashboard/inbox", color: "bg-purple-50 text-purple-600" },
  { icon: BarChart2, label: "Ver analytics", to: "/dashboard/analytics", color: "bg-orange-50 text-orange-600" },
  { icon: Link2, label: "Conectar rede", to: "/dashboard/social", color: "bg-primary-50 text-primary-600" },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: socialAccounts } = useSocialAccounts();
  const { data: posts } = useScheduledPosts();
  const { data: conversations } = useConversations();

  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const scheduledThisWeek = (posts ?? []).filter(
    (p) => p.status === "scheduled" && new Date(p.scheduled_at) <= weekEnd
  ).length;
  const unreadMessages = (conversations ?? []).reduce((acc, c) => acc + c.unread_count, 0);
  const connectedCount = socialAccounts?.length ?? 0;

  const stats = [
    { label: "Posts agendados", value: scheduledThisWeek, sub: "próximos 7 dias", to: "/dashboard/scheduler" },
    { label: "Mensagens na inbox", value: unreadMessages, sub: "não lidas", to: "/dashboard/inbox" },
    { label: "Contas conectadas", value: connectedCount, sub: "de 3 disponíveis", to: "/dashboard/social" },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao Vaiteia. Suas redes, no mesmo lugar.
        </p>
      </div>

      {/* Banner — e-mail não verificado */}
      {user && !user.email_verified && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
          <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
          <div className="flex-1 text-sm">
            <p className="font-medium text-yellow-800">Confirme seu e-mail</p>
            <p className="text-yellow-700">
              Verifique sua caixa de entrada e clique no link para ativar sua conta.
            </p>
          </div>
        </div>
      )}

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map(({ icon: Icon, label, to, color }) => (
          <Link key={to} to={to}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 pb-5 flex flex-col items-center gap-3 text-center">
                <div className={`rounded-full p-3 ${color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CTA — conectar redes sociais (só exibe se nenhuma conta conectada) */}
      {connectedCount === 0 && (
        <Card className="border-dashed border-2 border-primary-200 bg-primary-50/30">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
            <Link2 className="text-primary-500" size={32} />
            <div>
              <p className="font-semibold text-foreground">Conecte suas redes sociais</p>
              <p className="text-sm text-muted-foreground mt-1">
                Vincule Instagram, Facebook ou TikTok para começar a agendar posts e gerenciar sua inbox.
              </p>
            </div>
            <Link to="/dashboard/social">
              <Button>Conectar agora</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
