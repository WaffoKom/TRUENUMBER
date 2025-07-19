import apiClient from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";

type SignUpData = {
  username: string;
  email: string;
  password: string;
  phone: string;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
  });
};
