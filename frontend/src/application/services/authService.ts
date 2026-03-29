import { httpClient } from "../../infrastructure/api/httpClient";

export const authService = {
  login: (data: { email: string; password: string }) =>
    httpClient.post("/auth/login", data),

  register: (data: { email: string; password: string; name: string }) =>
    httpClient.post("/auth/register", data)
};