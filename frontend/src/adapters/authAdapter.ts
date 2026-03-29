import { authService } from "../application/services/authService";

export const authAdapter = {
  async login(data: { email: string; password: string }) {
    const response = await authService.login(data);

    return {
      token: response.accessToken,
      user: response.user
    };
  },

  async register(data: { email: string; password: string; name: string }) {
    const response = await authService.register(data);

    return response; // normalmente no trae token
  }
};