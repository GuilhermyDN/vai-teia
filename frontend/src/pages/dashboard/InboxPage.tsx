import { useState } from "react";
import { Search, Send, Instagram, Facebook, MessageCircle, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConversations, useConversation, useSendMessage } from "@/hooks/useInbox";
import type { Platform, ConversationOut } from "@/types";

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.2 8.2 0 004.79 1.53V7.04a4.85 4.85 0 01-1.02-.35z" />
    </svg>
  );
}

const PLATFORM_META: Record<Platform, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  instagram: { icon: Instagram as unknown as React.ComponentType<{ size?: number; className?: string }>, color: "text-pink-500", bg: "bg-pink-50" },
  facebook: { icon: Facebook as unknown as React.ComponentType<{ size?: number; className?: string }>, color: "text-blue-600", bg: "bg-blue-50" },
  tiktok: { icon: TikTokIcon, color: "text-slate-900", bg: "bg-slate-100" },
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
  const meta = PLATFORM_META[conv.platform];
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border/50 ${active ? "bg-accent" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-medium">
            {getInitials(conv.contact_name)}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 rounded-full p-0.5 ${meta.bg}`}>
            <Icon size={10} className={meta.color} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">{conv.contact_name}</p>
            <span className="text-xs text-muted-foreground ml-2 shrink-0">
              {formatRelativeTime(conv.last_message_at)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs text-muted-foreground truncate">{conv.last_message_text ?? ""}</p>
            {conv.unread_count > 0 && (
              <Badge className="ml-2 h-4 min-w-4 text-[10px] px-1 shrink-0 bg-primary-500">
                {conv.unread_count}
              </Badge>
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
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [reply, setReply] = useState("");

  const { data: conversations, isLoading, refetch } = useConversations();
  const { data: detail, isLoading: loadingDetail } = useConversation(selectedId);
  const sendMessage = useSendMessage(selectedId);

  const totalUnread = (conversations ?? []).reduce((acc, c) => acc + c.unread_count, 0);

  const filtered = (conversations ?? []).filter((c) => {
    const matchSearch = c.contact_name.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === "all" || c.platform === platformFilter;
    return matchSearch && matchPlatform;
  });

  async function handleSend() {
    if (!reply.trim() || !selectedId) return;
    await sendMessage.mutateAsync(reply.trim());
    setReply("");
  }

  return (
    <div className="flex h-[calc(100vh-112px)] -mx-6 -mb-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 shrink-0 flex flex-col border-r border-border bg-background">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">
              Inbox
              {totalUnread > 0 && (
                <Badge className="ml-2 bg-primary-500 text-xs">{totalUnread}</Badge>
              )}
            </h2>
            <button onClick={() => refetch()} className="text-muted-foreground hover:text-foreground">
              <RefreshCw size={15} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar contatos..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 mt-2">
            {(["all", "instagram", "facebook", "tiktok"] as const).map((p) => {
              const meta = p !== "all" ? PLATFORM_META[p] : null;
              const Icon = meta?.icon;
              return (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
                    platformFilter === p
                      ? "bg-primary-500 text-white border-transparent"
                      : "border-input text-muted-foreground hover:border-primary-300"
                  }`}
                >
                  {Icon ? <Icon size={11} /> : null}
                  {p === "all" ? "Todas" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-primary-500" size={24} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
              <MessageCircle size={32} className="mb-2 text-primary-200" />
              <p className="text-sm">
                {(conversations ?? []).length === 0
                  ? "Nenhuma mensagem ainda. Conecte uma rede social para receber mensagens."
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

      {/* Área de mensagens */}
      {selectedId ? (
        <div className="flex-1 flex flex-col bg-background">
          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-500" size={24} />
            </div>
          ) : detail ? (
            <>
              <div className="px-6 py-3 border-b border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-medium shrink-0">
                  {getInitials(detail.contact_name)}
                </div>
                <div>
                  <p className="font-medium text-sm">{detail.contact_name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {(() => {
                      const meta = PLATFORM_META[detail.platform];
                      const Icon = meta.icon;
                      return <Icon size={11} className={meta.color} />;
                    })()}
                    @{detail.social_account_username}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {detail.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                        msg.direction === "outbound"
                          ? "bg-primary-500 text-white rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.direction === "outbound" ? "text-primary-200" : "text-muted-foreground"}`}>
                        {new Date(msg.sent_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-border flex gap-2">
                <Input
                  placeholder="Escreva uma resposta..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!reply.trim() || sendMessage.isPending}
                  className="gap-1.5"
                >
                  {sendMessage.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Enviar
                </Button>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <MessageCircle size={48} className="text-primary-200" />
          <p className="font-medium">Selecione uma conversa</p>
          <p className="text-sm">Escolha uma conversa na lista para visualizar as mensagens.</p>
        </div>
      )}
    </div>
  );
}
