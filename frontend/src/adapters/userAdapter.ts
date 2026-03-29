import { userService } from "../application/services/userService";

// función helper para estandarizar respuestas
const unwrap = (response: any) => {
  if (!response) throw new Error("Sin respuesta del servidor");

  if (response.success === false) {
    throw new Error(response.message || "Error");
  }

  return response.data;
};

export const userAdapter = {
  async getUsers(search: string, token: string) {
    const response = await userService.getUsers(search, 1, 10, token);
    return unwrap(response);
  },

  async getUserById(id: string, token: string) {
    const response = await userService.getUserById(id, token);
    return unwrap(response);
  },

  async createUser(data: any, token: string) {
    const response = await userService.createUser(data, token);
    return unwrap(response);
  },

  async updateUser(id: string, data: any, token: string) {
    const response = await userService.updateUser(id, data, token);
    return unwrap(response);
  },

  async deleteUser(id: string, token: string) {
    await userService.deleteUser(id, token);
    return true;
  }
};