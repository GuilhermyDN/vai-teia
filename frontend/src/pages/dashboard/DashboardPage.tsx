import { useAuthStore } from "@/store/auth.store";
import { Calendar, Inbox, BarChart2, Share2, AlertTriangle, TrendingUp, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSocialAccounts } from "@/hooks/useSocial";
import { useScheduledPosts } from "@/hooks/useScheduler";
import { useConversations } from "@/hooks/useInbox";

const quickActions = [
  {
    icon: Calendar,
    label: "Agendar post",
    description: "Programe publicações",
    to: "/dashboard/scheduler",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: Inbox,
    label: "Ver inbox",
    description: "Mensagens pendentes",
    to: "/dashboard/inbox",
    gradient: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    description: "Métricas e resultados",
    to: "/dashboard/analytics",
    gradient: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  {
    icon: Share2,
    label: "Conectar rede",
    description: "Instagram, Facebook...",
    to: "/dashboard/social",
    gradient: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
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
    {
      label: "Posts agendados",
      value: scheduledThisWeek,
      sub: "próximos 7 dias",
      to: "/dashboard/scheduler",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Mensagens",
      value: unreadMessages,
      sub: "não lidas",
      to: "/dashboard/inbox",
      icon: Inbox,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Contas conectadas",
      value: connectedCount,
      sub: "de 3 disponíveis",
      to: "/dashboard/social",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Aqui está um resumo das suas redes sociais.
          </p>
        </div>
        <div className="shrink-0">
          <Link to="/dashboard/scheduler">
            <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Calendar size={15} /> Novo post
            </Button>
          </Link>
        </div>
      </div>

      {/* Email verification banner */}
      {user && !user.email_verified && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={17} />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-amber-800">Confirme seu e-mail</p>
            <p className="text-amber-700 mt-0.5">
              Verifique sua caixa de entrada e clique no link para ativar sua conta.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, to, icon: Icon, color, bg }) => (
          <Link key={label} to={to}>
            <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`rounded-xl p-2 ${bg}`}>
                  <Icon size={17} className={color} />
                </div>
                <TrendingUp size={14} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-slate-900 leading-none">{value}</p>
              <p className="text-[0.8125rem] font-medium text-slate-600 mt-1">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Ações rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, description, to, bg, text, border }) => (
            <Link key={to} to={to}>
              <div className={`group bg-white rounded-2xl border ${border} p-4 hover:shadow-md transition-all duration-200 cursor-pointer h-full`}>
                <div className={`rounded-xl p-2.5 ${bg} w-fit mb-3`}>
                  <Icon size={18} className={text} />
                </div>
                <p className="text-[0.8125rem] font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA — sem contas conectadas */}
      {connectedCount === 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
            <Share2 size={22} className="text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-slate-800">Conecte suas redes sociais</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Vincule Instagram, Facebook ou TikTok para começar a agendar posts e gerenciar sua inbox.
            </p>
          </div>
          <Link to="/dashboard/social" className="shrink-0">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              Conectar agora
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
