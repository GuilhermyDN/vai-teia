import { useState, useRef } from "react";
import {
  Calendar,
  Plus,
  Clock,
  Image as ImageIcon,
  Trash2,
  X,
  Loader2,
  Upload,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useScheduledPosts, useCreatePost, useDeletePost } from "@/hooks/useScheduler";
import { useSocialAccounts } from "@/hooks/useSocial";
import type { PostStatus, Platform } from "@/types";

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.2 8.2 0 004.79 1.53V7.04a4.85 4.85 0 01-1.02-.35z" />
    </svg>
  );
}

import { Instagram, Facebook } from "lucide-react";

const PLATFORM_META: Record<Platform, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  instagram: { label: "Instagram", icon: Instagram as unknown as React.ComponentType<{ size?: number; className?: string }>, color: "text-pink-500", bg: "bg-pink-50" },
  facebook: { label: "Facebook", icon: Facebook as unknown as React.ComponentType<{ size?: number; className?: string }>, color: "text-blue-600", bg: "bg-blue-50" },
  tiktok: { label: "TikTok", icon: TikTokIcon, color: "text-slate-900", bg: "bg-slate-100" },
};

const STATUS_META: Record<PostStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Agendado", variant: "default" },
  published: { label: "Publicado", variant: "secondary" },
  failed: { label: "Falhou", variant: "destructive" },
  draft: { label: "Rascunho", variant: "outline" },
  publishing: { label: "Publicando", variant: "outline" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function ComposeModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: accounts, isLoading: loadingAccounts } = useSocialAccounts();
  const createPost = useCreatePost();

  function toggleAccount(id: number) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    // Local preview via blob URL (avoids ngrok header restriction em img tags)
    const blobUrl = URL.createObjectURL(file);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post<{ url: string }>("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMediaUrls((prev) => [...prev, data.url]);
      setPreviews((prev) => [...prev, blobUrl]);
    } catch (err: any) {
      URL.revokeObjectURL(blobUrl);
      setUploadError(err?.response?.data?.detail ?? "Erro ao fazer upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeMedia(index: number) {
    URL.revokeObjectURL(previews[index]);
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!caption.trim() || selectedIds.length === 0) return;
    await createPost.mutateAsync({
      caption: caption.trim(),
      media_urls: mediaUrls,
      scheduled_at: new Date(scheduledAt).toISOString(),
      social_account_ids: selectedIds,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <div className="px-6 pt-5 pb-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Novo post agendado</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          {createPost.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
              {(createPost.error as any)?.response?.data?.detail ?? "Erro ao criar post."}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Legenda</Label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              rows={4}
              placeholder="Escreva a legenda do post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2200}
            />
            <p className="text-xs text-muted-foreground text-right">{caption.length}/2200</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadError && (
            <p className="text-xs text-destructive">{uploadError}</p>
          )}

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  {mediaUrls[i]?.match(/\.(mp4|mov)$/i) ? (
                    <video src={url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-2 border-dashed rounded-lg p-5 flex flex-col items-center gap-2 text-muted-foreground cursor-pointer hover:border-primary-300 transition-colors w-full disabled:opacity-50"
          >
            {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
            <p className="text-sm">{uploading ? "Enviando..." : "Clique para adicionar imagem ou vídeo"}</p>
            <p className="text-xs">JPEG, PNG, GIF, WEBP, MP4 — máx. 100 MB</p>
          </button>

          <div className="space-y-1.5">
            <Label>Publicar em</Label>
            {loadingAccounts ? (
              <p className="text-sm text-muted-foreground">Carregando contas...</p>
            ) : !accounts?.length ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma conta conectada.{" "}
                <a href="/dashboard/social" className="text-primary-600 underline">
                  Conectar agora
                </a>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {accounts.map((acc) => {
                  const meta = PLATFORM_META[acc.platform];
                  const Icon = meta.icon;
                  const active = selectedIds.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAccount(acc.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                        active
                          ? `${meta.bg} ${meta.color} border-transparent font-medium`
                          : "border-input text-muted-foreground"
                      }`}
                    >
                      <Icon size={13} /> @{acc.username}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scheduled_at">Data e hora</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!caption.trim() || selectedIds.length === 0 || createPost.isPending}
            >
              {createPost.isPending ? <Loader2 size={14} className="animate-spin" /> : "Agendar post"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function SchedulerPage() {
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [showCompose, setShowCompose] = useState(false);

  const { data: posts, isLoading, isError, refetch } = useScheduledPosts();
  const deletePost = useDeletePost();

  const scheduled = (posts ?? []).filter((p) => p.status === "scheduled");
  const filtered = filter === "all" ? (posts ?? []) : (posts ?? []).filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agendamento</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Carregando..." : `${scheduled.length} post${scheduled.length !== 1 ? "s" : ""} agendado${scheduled.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => setShowCompose(true)} className="gap-2">
          <Plus size={16} /> Novo post
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "scheduled", "published", "draft", "failed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              filter === f
                ? "bg-primary-500 text-white border-transparent"
                : "border-input text-muted-foreground hover:border-primary-300"
            }`}
          >
            {f === "all" ? "Todos" : STATUS_META[f].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary-500" size={28} />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
            <p className="text-sm">Erro ao carregar posts.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-12 pb-12 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <Calendar size={36} className="text-primary-300" />
            <p className="font-medium">Nenhum post encontrado</p>
            <p className="text-sm">
              {filter === "all"
                ? 'Clique em "Novo post" para agendar sua primeira publicação.'
                : "Não há posts com esse filtro."}
            </p>
            {filter === "all" && (
              <Button className="mt-2" onClick={() => setShowCompose(true)}>
                Criar post
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered
            .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
            .map((post) => {
              const statusMeta = STATUS_META[post.status];
              return (
                <Card key={post.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2 text-foreground">
                          {post.caption ?? <span className="text-muted-foreground italic">Sem legenda</span>}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            {formatDate(post.scheduled_at)}
                          </div>
                          <div className="flex gap-1">
                            {post.accounts.map((acc) => {
                              const meta = PLATFORM_META[acc.platform];
                              const Icon = meta.icon;
                              return (
                                <span key={acc.id} className={meta.color} title={`@${acc.username}`}>
                                  <Icon size={13} />
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={statusMeta.variant} className="text-xs">
                          {statusMeta.label}
                        </Badge>
                        {post.status !== "published" && (
                          <button
                            onClick={() => deletePost.mutate(post.id)}
                            disabled={deletePost.isPending}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            {deletePost.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
