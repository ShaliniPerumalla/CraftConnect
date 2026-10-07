const API_BASE_URL = "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.detail || `Request failed: ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
}

const api = {
  get: (endpoint, config = {}) => {
    const params = new URLSearchParams(config.params || {});
    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`${endpoint}${query}`);
  },

  post: (endpoint, body, config = {}) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? config.headers
          : { "Content-Type": "application/json", ...(config.headers || {}) },
    }),

  patch: (endpoint, body, config = {}) =>
    request(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers:
        body instanceof FormData
          ? config.headers
          : { "Content-Type": "application/json", ...(config.headers || {}) },
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE",
    }),
};

export default api;
