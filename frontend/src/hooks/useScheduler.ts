import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ScheduledPost, ScheduledPostCreate, PostStatus } from "@/types";

export function useScheduledPosts(status?: PostStatus | "all") {
  return useQuery<ScheduledPost[]>({
    queryKey: ["scheduled-posts", status],
    queryFn: async () => {
      const params = status && status !== "all" ? { status } : {};
      const { data } = await api.get<ScheduledPost[]>("/scheduler/posts", { params });
      return data;
    },
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ScheduledPostCreate) => {
      const { data } = await api.post<ScheduledPost>("/scheduler/posts", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduled-posts"] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      await api.delete(`/scheduler/posts/${postId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduled-posts"] });
    },
  });
}
