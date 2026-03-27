import { useState, useEffect } from "react";
import {
  CheckCircle2, Zap, Building2, Briefcase, ArrowRight, CreditCard,
  Loader2, CheckCircle, XCircle, type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription, useCreateCheckout, usePortal } from "@/hooks/useBilling";
import { useSocialAccounts } from "@/hooks/useSocial";
import { useScheduledPosts } from "@/hooks/useScheduler";
import type { PlanId } from "@/types";

type BillingInterval = "monthly" | "yearly";

interface PlanConfig {
  id: PlanId;
  name: string;
  icon: LucideIcon;
  color: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  limits: { social_accounts: number; scheduled_posts: number; workspaces: number; team_members: number };
  highlighted?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    color: "text-slate-500",
    price: { monthly: 0, yearly: 0 },
    description: "Para quem está começando a gerenciar suas redes.",
    features: ["1 conta social", "30 posts agendados/mês", "Inbox unificada", "1 usuário", "Suporte por e-mail"],
    limits: { social_accounts: 1, scheduled_posts: 30, workspaces: 1, team_members: 1 },
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    color: "text-primary-500",
    price: { monthly: 49, yearly: 39 },
    description: "Para criadores e pequenas empresas em crescimento.",
    features: ["3 contas sociais", "Posts ilimitados", "Inbox + respostas automáticas", "Analytics básico", "1 usuário", "Suporte prioritário"],
    limits: { social_accounts: 3, scheduled_posts: -1, workspaces: 1, team_members: 1 },
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    color: "text-purple-500",
    price: { monthly: 99, yearly: 79 },
    description: "Para equipes que gerenciam múltiplas marcas.",
    features: ["10 contas sociais", "Posts ilimitados", "Analytics avançado + exportação", "Até 5 usuários", "Aprovação de conteúdo", "Suporte 24h"],
    limits: { social_accounts: 10, scheduled_posts: -1, workspaces: 3, team_members: 5 },
  },
  {
    id: "agency",
    name: "Agency",
    icon: Building2,
    color: "text-orange-500",
    price: { monthly: 249, yearly: 199 },
    description: "Para agências com múltiplos clientes.",
    features: ["Contas ilimitadas", "Posts ilimitados", "White-label", "Usuários ilimitados", "API de integração", "Gerente dedicado"],
    limits: { social_accounts: -1, scheduled_posts: -1, workspaces: -1, team_members: -1 },
  },
];

const PLAN_STATUS_LABEL: Record<string, string> = {
  trialing: "Trial",
  active: "Ativo",
  past_due: "Em atraso",
  canceled: "Cancelado",
  incomplete: "Incompleto",
};

function formatLimit(n: number) {
  return n === -1 ? "Ilimitado" : String(n);
}

function PlanCard({ plan, current, interval, onSelect, loading }: {
  plan: PlanConfig;
  current: boolean;
  interval: BillingInterval;
  onSelect: (id: PlanId) => void;
  loading?: boolean;
}) {
  const Icon = plan.icon;
  const price = plan.price[interval];
  return (
    <Card className={`relative flex flex-col transition-shadow ${
      plan.highlighted ? "border-primary-400 shadow-md ring-1 ring-primary-300" : current ? "border-primary-200" : ""
    }`}>
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary-500 text-white text-xs px-3">Mais popular</Badge>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon size={18} className={plan.color} />
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {current && <Badge variant="secondary" className="ml-auto text-xs">Plano atual</Badge>}
        </div>
        <CardDescription className="text-xs mt-1">{plan.description}</CardDescription>
        <div className="mt-3">
          {price === 0 ? (
            <p className="text-3xl font-bold">Grátis</p>
          ) : (
            <p className="text-3xl font-bold">
              R$&thinsp;{price}
              <span className="text-sm font-normal text-muted-foreground">/mês</span>
            </p>
          )}
          {interval === "yearly" && price > 0 && (
            <p className="text-xs text-primary-600 mt-0.5">Faturado anualmente — R$&thinsp;{price * 12}/ano</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <ul className="space-y-2 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Button
          className="w-full gap-1.5"
          variant={current ? "outline" : plan.highlighted ? "default" : "outline"}
          disabled={current || plan.price[interval] === 0 || loading}
          onClick={() => onSelect(plan.id)}
        >
          {loading
            ? <Loader2 size={14} className="animate-spin" />
            : current
              ? "Plano atual"
              : plan.price[interval] === 0
                ? "Plano gratuito"
                : <><ArrowRight size={14} /> Assinar {plan.name}</>}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: subscription, isLoading, isError, refetch } = useSubscription();
  const { data: socialAccounts } = useSocialAccounts();
  const { data: posts } = useScheduledPosts();
  const checkout = useCreateCheckout();
  const portal = usePortal();

  const stripeSuccess = searchParams.get("success") === "true";
  const stripeCanceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    if (stripeSuccess) {
      refetch();
      setSearchParams({}, { replace: true });
    } else if (stripeCanceled) {
      setSearchParams({}, { replace: true });
    }
  }, [stripeSuccess, stripeCanceled]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectPlan(planId: PlanId) {
    checkout.mutate({ plan_id: planId, interval });
  }

  const currentPlan = PLANS.find((p) => p.id === (subscription?.plan_id ?? "starter"))!;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Plano & Billing</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua assinatura e método de pagamento.</p>
      </div>

      {stripeSuccess && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          Assinatura ativada com sucesso! Bem-vindo ao novo plano.
        </div>
      )}
      {stripeCanceled && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          <XCircle size={16} className="text-yellow-600 shrink-0" />
          Pagamento cancelado. Você ainda está no plano atual.
        </div>
      )}

      {/* Status da assinatura */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-primary-500" size={24} />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
            <p className="text-sm">Erro ao carregar assinatura.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : subscription && (
        <>
          <Card className="border-primary-200 bg-primary-50/30">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary-100 p-2">
                    <currentPlan.icon size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Plano {currentPlan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {PLAN_STATUS_LABEL[subscription.status] ?? subscription.status}
                      {subscription.current_period_end && (
                        <> — renova em {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}</>
                      )}
                      {subscription.trial_ends_at && !subscription.current_period_end && (
                        <> — trial até {new Date(subscription.trial_ends_at).toLocaleDateString("pt-BR")}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={portal.isPending || !subscription?.plan_id || subscription.plan_id === "starter"}
                    onClick={() => portal.mutate()}
                  >
                    {portal.isPending
                      ? <Loader2 size={14} className="animate-spin" />
                      : <CreditCard size={14} />}
                    Gerenciar assinatura
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uso atual */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Uso atual ({currentPlan.name})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Contas sociais", used: (socialAccounts ?? []).length, max: currentPlan.limits.social_accounts },
                { label: "Posts agendados", used: (posts ?? []).filter((p) => p.status === "scheduled").length, max: currentPlan.limits.scheduled_posts },
                { label: "Workspaces", used: 1, max: currentPlan.limits.workspaces },
                { label: "Membros", used: 1, max: currentPlan.limits.team_members },
              ].map((item) => {
                const pct = item.max === -1 || item.used === 0 ? 0 : Math.min(100, Math.round((item.used / item.max) * 100));
                return (
                  <Card key={item.label}>
                    <CardContent className="pt-4 pb-4">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-bold mt-1">
                        {item.used}
                        <span className="text-sm font-normal text-muted-foreground">/{formatLimit(item.max)}</span>
                      </p>
                      {item.max !== -1 && (
                        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-primary-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Planos */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Todos os planos</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(["monthly", "yearly"] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setInterval(i)}
                  className={`px-3 py-1 rounded text-sm transition-all ${interval === i ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
                >
                  {i === "monthly" ? "Mensal" : "Anual"}
                </button>
              ))}
            </div>
            {interval === "yearly" && (
              <Badge className="bg-primary-100 text-primary-700 text-xs">Economize ~20%</Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={plan.id === (subscription?.plan_id ?? "starter")}
              interval={interval}
              onSelect={handleSelectPlan}
              loading={checkout.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
