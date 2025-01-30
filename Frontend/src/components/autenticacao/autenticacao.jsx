import { jwtDecode } from "jwt-decode";

// Verifica se o usuário está autenticado e retorna o nível de acesso
export const verificarAutenticacao = () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("Token não encontrado. Usuário não autenticado.");
            return null;
        }

        const decoded = jwtDecode(token);

        // Verifica se o token está expirado
        const agora = Date.now() / 1000; // Converte para segundos
        if (decoded.exp && decoded.exp < agora) {
            console.warn("Token expirado! Realizando logout.");
            logout();
            return null;
        }

        // Armazena os dados do usuário na sessão para evitar múltiplas decodificações
        sessionStorage.setItem("userData", JSON.stringify(decoded));

        return Number(decoded.role); // 🔹 Converte para número para evitar erros de tipo
    } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        return null; // Retorna null em caso de erro
    }
};

// Função para obter informações do usuário logado
export const getUsuarioLogado = () => {
    try {
        const userData = sessionStorage.getItem("userData");
        if (userData) {
            return JSON.parse(userData);
        }

        // Se não encontrar no sessionStorage, tenta recuperar e decodificar o token novamente
        const token = localStorage.getItem("token");
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Erro ao obter dados do usuário logado:", error);
        return null;
    }
};

// Função para logout
export const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("userData"); // Remove cache da sessão
    window.location.href = "/login"; // Redireciona para o login
};
