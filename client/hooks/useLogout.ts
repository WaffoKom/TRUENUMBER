import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (err) => {
      console.error("Logout error", err);
    },
  });
};
