import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Log detalhado de todas as requisições
api.interceptors.request.use((request) => {
  console.log("Detalhes da requisição:", {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers,
  });
  return request;
});

// Log detalhado de todas as respostas
api.interceptors.response.use(
  (response) => {
    console.log("Detalhes da resposta:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Detalhes do erro:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      fullError: error,
    });
    return Promise.reject(error);
  }
);

// Configuração do token apenas para rotas autenticadas
api.interceptors.request.use((config) => {
  // Lista de rotas públicas que não precisam de token
  const publicRoutes = ["/login", "/user"];

  if (!publicRoutes.includes(config.url)) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
