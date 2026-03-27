import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ConversationOut, ConversationDetailOut, MessageOut } from "@/types";

export function useConversations() {
  return useQuery<ConversationOut[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get<ConversationOut[]>("/inbox/conversations");
      return data;
    },
  });
}

export function useConversation(id: number | null) {
  return useQuery<ConversationDetailOut>({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const { data } = await api.get<ConversationDetailOut>(`/inbox/conversations/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}

export function useSendMessage(conversationId: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post<MessageOut>(
        `/inbox/conversations/${conversationId}/messages`,
        { text }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
