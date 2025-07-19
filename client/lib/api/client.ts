import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:7200/api"
    : undefined);

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export default apiClient;
