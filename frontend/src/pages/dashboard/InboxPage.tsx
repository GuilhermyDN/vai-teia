import { useState } from "react";
import { Search, Send, Instagram, Facebook, MessageCircle, RefreshCw, Loader2, MessageSquare, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConversations, useConversation, useSendMessage } from "@/hooks/useInbox";
import type { Platform, ConversationOut, ConversationType } from "@/types";

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.2 8.2 0 004.79 1.53V7.04a4.85 4.85 0 01-1.02-.35z" />
    </svg>
  );
}

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const PLATFORM_META: Record<Platform, { icon: IconComponent; color: string; bg: string; label: string }> = {
  instagram: { icon: Instagram as unknown as IconComponent, color: "text-pink-500", bg: "bg-pink-50", label: "Instagram" },
  facebook: { icon: Facebook as unknown as IconComponent, color: "text-blue-600", bg: "bg-blue-50", label: "Facebook" },
  tiktok: { icon: TikTokIcon as IconComponent, color: "text-slate-900", bg: "bg-slate-100", label: "TikTok" },
};

const CONV_TYPE_META: Record<ConversationType, {
  label: string;
  icon: IconComponent;
  color: string;
  bg: string;
  avatarBg: string;
  avatarText: string;
  border: string;
}> = {
  dm: {
    label: "Direct",
    icon: MessageCircle as unknown as IconComponent,
    color: "text-violet-600",
    bg: "bg-violet-50",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-700",
    border: "border-l-violet-400",
  },
  comment: {
    label: "Comentário",
    icon: MessageSquare as unknown as IconComponent,
    color: "text-amber-600",
    bg: "bg-amber-50",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
    border: "border-l-amber-400",
  },
};

function formatRelativeTime(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function ConversationItem({ conv, active, onClick }: { conv: ConversationOut; active: boolean; onClick: () => void }) {
  const platMeta = PLATFORM_META[conv.platform];
  const PlatIcon = platMeta.icon;
  const typeMeta = CONV_TYPE_META[conv.conversation_type ?? "dm"];
  const TypeIcon = typeMeta.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-border/50 border-l-2 transition-all ${typeMeta.border} ${
        active ? "bg-accent" : "hover:bg-accent/50"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar com cor por tipo */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full ${typeMeta.avatarBg} flex items-center justify-center ${typeMeta.avatarText} text-sm font-semibold`}>
            {getInitials(conv.contact_name)}
          </div>
          {/* Ícone da plataforma no canto */}
          <div className={`absolute -bottom-0.5 -right-0.5 rounded-full p-[3px] ${platMeta.bg} border border-white`}>
            <PlatIcon size={9} className={platMeta.color} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-sm font-medium truncate">{conv.contact_name}</p>
            <span className="text-[11px] text-muted-foreground shrink-0">{formatRelativeTime(conv.last_message_at)}</span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            {/* Badge de tipo + preview */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-medium ${typeMeta.bg} ${typeMeta.color}`}>
                <TypeIcon size={9} />
                {typeMeta.label}
              </span>
              <p className="text-xs text-muted-foreground truncate">{conv.last_message_text ?? ""}</p>
            </div>
            {conv.unread_count > 0 && (
              <Badge className="h-4 min-w-4 text-[10px] px-1 shrink-0 bg-primary-500">{conv.unread_count}</Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ConversationType | "all">("all");
  const [reply, setReply] = useState("");

  const { data: conversations, isLoading, refetch } = useConversations();
  const { data: detail, isLoading: loadingDetail } = useConversation(selectedId);
  const sendMessage = useSendMessage(selectedId);

  const totalUnread = (conversations ?? []).reduce((acc, c) => acc + c.unread_count, 0);

  const filtered = (conversations ?? []).filter((c) => {
    const matchSearch = c.contact_name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || (c.conversation_type ?? "dm") === typeFilter;
    return matchSearch && matchType;
  });

  async function handleSend() {
    if (!reply.trim() || !selectedId) return;
    await sendMessage.mutateAsync(reply.trim());
    setReply("");
  }

  const convTypeMeta = detail ? CONV_TYPE_META[detail.conversation_type ?? "dm"] : null;
  const convPlatMeta = detail ? PLATFORM_META[detail.platform] : null;

  return (
    <div className="flex h-[calc(100vh-112px)] -mx-6 -mb-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 shrink-0 flex flex-col border-r border-border bg-background">
        <div className="px-4 py-3 border-b border-border space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">
              Inbox
              {totalUnread > 0 && <Badge className="ml-2 bg-primary-500 text-[10px]">{totalUnread}</Badge>}
            </h2>
            <button onClick={() => refetch()} className="text-muted-foreground hover:text-foreground">
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-8 h-7 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* Filtros por tipo */}
          <div className="flex gap-1">
            {(["all", "dm", "comment"] as const).map((t) => {
              const meta = t !== "all" ? CONV_TYPE_META[t] : null;
              const Icon = meta?.icon;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border font-medium transition-all ${
                    typeFilter === t
                      ? t === "dm"
                        ? "bg-violet-500 text-white border-transparent"
                        : t === "comment"
                        ? "bg-amber-500 text-white border-transparent"
                        : "bg-primary-500 text-white border-transparent"
                      : "border-input text-muted-foreground hover:border-slate-300"
                  }`}
                >
                  {Icon && <Icon size={10} />}
                  {t === "all" ? "Todos" : t === "dm" ? "Direct" : "Comentários"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-primary-500" size={22} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4 gap-2">
              <MessageCircle size={30} className="text-primary-200" />
              <p className="text-sm">
                {(conversations ?? []).length === 0
                  ? "Nenhuma mensagem ainda."
                  : "Nenhuma conversa encontrada."}
              </p>
            </div>
          ) : (
            filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                active={conv.id === selectedId}
                onClick={() => setSelectedId(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Área de chat */}
      {selectedId ? (
        <div className="flex-1 flex flex-col bg-background min-w-0">
          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-500" size={24} />
            </div>
          ) : detail && convTypeMeta && convPlatMeta ? (
            <>
              {/* Header */}
              <div className={`px-6 py-3 border-b border-border flex items-center gap-3 ${convTypeMeta.bg}`}>
                <div className={`w-9 h-9 rounded-full ${convTypeMeta.avatarBg} flex items-center justify-center ${convTypeMeta.avatarText} text-sm font-semibold shrink-0`}>
                  {getInitials(detail.contact_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{detail.contact_name}</p>
                    {/* Badge de tipo grande no header */}
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold ${convTypeMeta.bg} ${convTypeMeta.color} border border-current/20`}>
                      <convTypeMeta.icon size={10} />
                      {convTypeMeta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <convPlatMeta.icon size={11} className={convPlatMeta.color} />
                    <span>@{detail.social_account_username}</span>
                    <span>·</span>
                    <span>{convPlatMeta.label}</span>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {detail.conversation_type === "comment" && (
                  <div className="flex justify-center">
                    <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                      <AtSign size={10} />
                      Comentário em publicação
                    </span>
                  </div>
                )}
                {detail.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                    {msg.direction === "inbound" && detail.conversation_type === "comment" ? (
                      // Comentários: visual de "post comment"
                      <div className="max-w-[75%] bg-amber-50 border border-amber-200 rounded-2xl rounded-bl-none px-4 py-2.5">
                        <p className="text-xs font-semibold text-amber-700 mb-1">@{detail.contact_name}</p>
                        <p className="text-sm text-foreground">{msg.text}</p>
                        <p className="text-[10px] text-amber-500 mt-1">
                          {new Date(msg.sent_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ) : msg.direction === "inbound" ? (
                      // DM recebida: balão roxo claro
                      <div className="max-w-[70%] bg-violet-50 border border-violet-100 rounded-2xl rounded-bl-none px-4 py-2">
                        <p className="text-sm text-foreground">{msg.text}</p>
                        <p className="text-[10px] text-violet-400 mt-1">
                          {new Date(msg.sent_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ) : (
                      // Enviada: balão primário
                      <div className="max-w-[70%] bg-primary-500 text-white rounded-2xl rounded-br-none px-4 py-2">
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-[10px] text-primary-200 mt-1">
                          {new Date(msg.sent_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input de resposta */}
              <div className="px-6 py-3 border-t border-border flex gap-2">
                <Input
                  placeholder={detail.conversation_type === "comment" ? "Responder ao comentário..." : "Escreva uma mensagem..."}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSend} disabled={!reply.trim() || sendMessage.isPending} className="gap-1.5">
                  {sendMessage.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Enviar
                </Button>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <MessageCircle size={44} className="text-primary-200" />
          <p className="font-medium">Selecione uma conversa</p>
          <p className="text-sm text-center max-w-xs">Escolha uma conversa na lista para visualizar as mensagens.</p>
        </div>
      )}
    </div>
  );
}
