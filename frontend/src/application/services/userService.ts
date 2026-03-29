import { httpClient } from "../../infrastructure/api/httpClient";

export const userService = {
    getUsers: (search = "", page = 1, size = 10, token: string) =>
        httpClient.get(
            `/users?search=${search}&page=${page}&size=${size}`,
            token
        ),

    deleteUser: (id: string, token: string) =>
        httpClient.delete(`/users/${id}`, token),

    createUser: (data: any, token: string) =>
        httpClient.post("/users", data, token),

    updateUser: (id: string, data: any, token: string) =>
        httpClient.put(`/users/${id}`, data, token),
    
    getUserById: (id: string, token: string) =>
        httpClient.get(`/users/${id}`, token),
};