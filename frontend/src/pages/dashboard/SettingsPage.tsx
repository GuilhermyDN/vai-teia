import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, Bell, Trash2, Camera, Save, Eye, EyeOff, CheckCircle2, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

// ── Schemas ───────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
  email: z.string().email("E-mail inválido."),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Informe a senha atual."),
    new_password: z.string().min(8, "Nova senha deve ter ao menos 8 caracteres."),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "As senhas não coincidem.",
    path: ["confirm_password"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ── Seção genérica ────────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-primary-500" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ── Perfil ────────────────────────────────────────────────────────────────────
function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  function getInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  async function onSubmit(data: ProfileForm) {
    setLoading(true);
    setError(null);
    try {
      const { data: updated } = await api.patch("/auth/me", data);
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section
      icon={User}
      title="Perfil"
      description="Atualize seu nome e e-mail de acesso."
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold">
            {user ? getInitials(user.name) : "?"}
          </div>
          <button className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-1 hover:bg-accent transition-colors">
            <Camera size={12} className="text-muted-foreground" />
          </button>
        </div>
        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg px-4 py-2 text-sm">
            <CheckCircle2 size={14} /> Perfil salvo com sucesso!
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>
        <Button type="submit" disabled={!isDirty || loading} className="gap-1.5">
          <Save size={14} /> {loading ? "Salvando..." : "Salvar perfil"}
        </Button>
      </form>
    </Section>
  );
}

// ── Senha ─────────────────────────────────────────────────────────────────────
function PasswordSection() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  async function onSubmit(data: PasswordForm) {
    setError(null);
    try {
      await api.post("/auth/change-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      setSaved(true);
      reset();
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Erro ao alterar senha.");
    }
  }

  const fields: { id: keyof PasswordForm; label: string; key: keyof typeof show }[] = [
    { id: "current_password", label: "Senha atual", key: "current" },
    { id: "new_password", label: "Nova senha", key: "new" },
    { id: "confirm_password", label: "Confirmar nova senha", key: "confirm" },
  ];

  return (
    <Section
      icon={Lock}
      title="Segurança"
      description="Altere sua senha de acesso."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg px-4 py-2 text-sm">
            <CheckCircle2 size={14} /> Senha alterada com sucesso!
          </div>
        )}
        {fields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <Label htmlFor={f.id}>{f.label}</Label>
            <div className="relative">
              <Input
                id={f.id}
                type={show[f.key] ? "text" : "password"}
                placeholder="••••••••"
                {...register(f.id)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShow((prev) => ({ ...prev, [f.key]: !prev[f.key] }))}
              >
                {show[f.key] ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors[f.id] && <p className="text-xs text-red-500">{errors[f.id]?.message}</p>}
          </div>
        ))}
        <Button type="submit" disabled={isSubmitting} className="gap-1.5">
          <Save size={14} /> {isSubmitting ? "Salvando..." : "Alterar senha"}
        </Button>
      </form>
    </Section>
  );
}

// ── Notificações ──────────────────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    new_message: true,
    post_published: true,
    post_failed: true,
    weekly_report: false,
    product_updates: true,
  });

  const NOTIFS = [
    { key: "new_message", label: "Nova mensagem na inbox", description: "Quando um contato enviar uma mensagem." },
    { key: "post_published", label: "Post publicado", description: "Confirmação quando um post for publicado com sucesso." },
    { key: "post_failed", label: "Falha na publicação", description: "Alerta se um post agendado falhar." },
    { key: "weekly_report", label: "Relatório semanal", description: "Resumo de performance toda segunda-feira." },
    { key: "product_updates", label: "Novidades do produto", description: "Atualizações e novos recursos do Vaiteia." },
  ];

  return (
    <Section
      icon={Bell}
      title="Notificações"
      description="Escolha quais e-mails você quer receber."
    >
      <div className="space-y-4">
        {NOTIFS.map((n) => (
          <div key={n.key} className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{n.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[n.key as keyof typeof prefs]}
              onClick={() => setPrefs((p) => ({ ...p, [n.key]: !p[n.key as keyof typeof prefs] }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                prefs[n.key as keyof typeof prefs] ? "bg-primary-500" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  prefs[n.key as keyof typeof prefs] ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
        <Button size="sm" className="mt-2 gap-1.5">
          <Save size={13} /> Salvar preferências
        </Button>
      </div>
    </Section>
  );
}

// ── Zona de perigo ────────────────────────────────────────────────────────────
function DangerZoneSection() {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const user = useAuthStore((s) => s.user);

  return (
    <Card className="border-destructive/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-destructive" />
          <CardTitle className="text-base text-destructive">Zona de perigo</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Ações irreversíveis. Proceda com cautela.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!confirming ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Excluir conta</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remove permanentemente sua conta e todos os dados associados.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={() => setConfirming(true)}
            >
              Excluir conta
            </Button>
          </div>
        ) : (
          <div className="space-y-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Tem certeza? Esta ação não pode ser desfeita.</p>
            <p className="text-xs text-red-700">
              Digite <strong>{user?.email}</strong> para confirmar:
            </p>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={user?.email}
              className="border-red-300 focus-visible:ring-red-400"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setConfirming(false); setTyped(""); }}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                disabled={typed !== user?.email}
                onClick={() => alert("Conta excluída (placeholder)")}
              >
                Excluir permanentemente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua conta e preferências.</p>
      </div>
      <ProfileSection />
      <PasswordSection />
      <NotificationsSection />
      <DangerZoneSection />
    </div>
  );
}
