const express = require("express");
const db = require("./dbConfig");
const router = express.Router();

// Rota para cadastrar um novo usuário
router.post("/cadastroUsuario", async (req, res) => {
    const { usuario, senha, nomeCompleto, administrador } = req.body;

    if (!usuario || !senha || !nomeCompleto || administrador === undefined) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
        // Verificar se o usuário já existe
        const verificarQuery = "SELECT * FROM usuarios WHERE usuario = ?";
        db.query(verificarQuery, [usuario], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao verificar usuário." });
            }
            
            if (result.length > 0) {
                return res.status(400).json({ message: "Usuário já cadastrado." });
            }

            // NÃO hasheia novamente a senha, pois já foi hasheada no frontend
            const senhaCriptografada = senha; 

            // Inserir novo usuário no banco
            const query = "INSERT INTO usuarios (usuario, senha, nome_completo, administrador) VALUES (?, ?, ?, ?)";
            db.query(query, [usuario, senhaCriptografada, nomeCompleto, administrador], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
                }
                res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Erro interno." });
    }
});

module.exports = router;
