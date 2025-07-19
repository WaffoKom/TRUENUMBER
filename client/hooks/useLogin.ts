import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

type LoginData = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationKey: ["UseLogin"],
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
  });
}
