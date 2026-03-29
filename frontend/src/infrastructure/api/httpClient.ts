const API_URL = import.meta.env.VITE_API_URL;

const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const handleResponse = async (res: Response) => {
  let data: any = null;
  let text = "";

  try {
    text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (res.status === 401) {
    const token = localStorage.getItem("token");

    if (token) {
      handleUnauthorized(); // solo si ya estabas logueado
    }

    throw new Error(
      data?.message || "No autorizado"
    );
  }

  if (!res.ok) {
    let message =
      data?.message ||
      data?.title ||
      data?.error ||
      "Error del servidor";
      
    const error: any = new Error(message);

    error.details = data?.errors || [];

    throw error;
  }

  return data;
};

export const httpClient = {
  // POST
  post: async (url: string, body: any, token?: string) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });

    return await handleResponse(res);
  },

  // GET
  get: async (url: string, token?: string) => {
    const res = await fetch(`${API_URL}${url}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    return await handleResponse(res);
  },

  // PUT
  put: async (url: string, body: any, token: string) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    return await handleResponse(res);
  },

  // DELETE
  delete: async (url: string, token: string) => {
    const res = await fetch(`${API_URL}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    await handleResponse(res);
    return true;
  }
};