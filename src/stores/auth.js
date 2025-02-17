import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.type === 1,
  },

  actions: {
    async login(credentials) {
      try {
        console.log("Enviando credenciais de login:", credentials);
        const { data } = await api.post("/login", {
          email: credentials.email,
          password: credentials.password,
        });

        console.log("Resposta do login:", data);

        if (data.token) {
          this.token = data.token;
          localStorage.setItem("token", data.token);

          // Buscar dados do usuário após login
          try {
            const userResponse = await api.get("/users/me");
            this.user = userResponse.data;
          } catch (userError) {
            console.error("Erro ao buscar dados do usuário:", userError);
          }

          return true;
        }
        throw new Error("Token não recebido do servidor");
      } catch (error) {
        console.error("Erro no login:", error);
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        throw error;
      }
    },

    async register(userData) {
      try {
        console.log("Enviando dados para registro:", userData);

        // Remover qualquer token existente para o registro
        delete api.defaults.headers.common["Authorization"];

        const response = await api.post("/user", {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        });

        console.log("Resposta do registro:", response.data);
        return true;
      } catch (error) {
        console.error("Erro no registro:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          fullError: error,
        });
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
  },
});
