// /app/hooks/useDeleteAccount.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me"); // Route protégée côté backend
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
