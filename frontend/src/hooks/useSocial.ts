import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { SocialAccount } from "@/types";

export function useSocialAccounts() {
  return useQuery<SocialAccount[]>({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const { data } = await api.get<SocialAccount[]>("/social/accounts");
      return data;
    },
  });
}

export function useDisconnectAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (accountId: number) => {
      await api.delete(`/social/accounts/${accountId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}
