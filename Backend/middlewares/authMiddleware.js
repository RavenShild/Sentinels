const jwt = require("jsonwebtoken");

const SECRET = "seuSegredoSuperSecreto"; // ⚠️ O ideal é armazenar em uma variável de ambiente segura

function verificarPermissao(allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            console.log("Token não fornecido"); // Log para depuração
            return res.status(403).json({ error: "Token não fornecido" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("Token inválido"); // Log para depuração
            return res.status(403).json({ error: "Token inválido" });
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log("Erro ao verificar token:", err);
                return res.status(401).json({ error: "Token inválido" });
            }

            console.log("Token decodificado:", decoded); // Verifica o que há dentro do token

            if (!decoded.id) {
                return res.status(403).json({ error: "Usuário sem ID no token" });
            }

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: "Acesso negado" });
            }

            req.user = { id: decoded.id, role: decoded.role }; // 🔹 Agora `req.user.id` estará acessível
            next();
        });
    };
}

module.exports = verificarPermissao;
