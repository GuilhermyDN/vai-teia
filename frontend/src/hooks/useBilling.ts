import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PlanId, Subscription } from "@/types";

export function useSubscription() {
  return useQuery<Subscription>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await api.get<Subscription>("/billing/subscription");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async ({
      plan_id,
      interval,
    }: {
      plan_id: PlanId;
      interval: "monthly" | "yearly";
    }) => {
      const { data } = await api.post<{ url: string }>("/billing/checkout", {
        plan_id,
        interval,
      });
      return data;
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });
}

export function usePortal() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ url: string }>("/billing/portal");
      return data;
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });
}
