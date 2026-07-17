const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL as string;
const SCHEDULER_API_URL = import.meta.env.VITE_SCHEDULER_API_URL as string;

const TOKEN_KEY = "scheduler.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(baseUrl: string, path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.mensagem ?? `Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  get: <T>(path: string) => request<T>(AUTH_API_URL, path),
  post: <T>(path: string, body: unknown) =>
    request<T>(AUTH_API_URL, path, { method: "POST", body: JSON.stringify(body) }),
};

export const schedulerApi = {
  get: <T>(path: string) => request<T>(SCHEDULER_API_URL, path),
  post: <T>(path: string, body: unknown) =>
    request<T>(SCHEDULER_API_URL, path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(SCHEDULER_API_URL, path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(SCHEDULER_API_URL, path, { method: "DELETE" }),
};
