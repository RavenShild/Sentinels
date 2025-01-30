const express = require("express");
const db = require("./dbConfig");
const bcrypt = require("bcrypt"); // ✅ Para criptografar a senha
const router = express.Router();

// Rota para listar todos os usuários
router.get("/usuarios", (req, res) => {
    db.query("SELECT id, usuario, nome_completo, administrador FROM usuarios", (err, results) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar usuários." });
        res.json(results);
    });
});


// Rota para obter um usuário por ID
router.get("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT id, usuario, nome_completo, administrador FROM usuarios WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar usuário." });
        if (result.length === 0) return res.status(404).json({ message: "Usuário não encontrado." });
        res.json(result[0]);
    });
});

// Rota para atualizar um usuário (incluindo a senha opcionalmente)
router.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario, nomeCompleto, administrador, novaSenha } = req.body;

    if (!usuario || !nomeCompleto || administrador === undefined) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios, exceto a senha." });
    }

    try {
        let query;
        let values;

        if (novaSenha) { // ✅ Atualiza a senha apenas se for enviada
            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
            query = "UPDATE usuarios SET usuario = ?, nome_completo = ?, administrador = ?, senha = ? WHERE id = ?";
            values = [usuario, nomeCompleto, administrador, senhaCriptografada, id];
        } else {
            query = "UPDATE usuarios SET usuario = ?, nome_completo = ?, administrador = ? WHERE id = ?";
            values = [usuario, nomeCompleto, administrador, id];
        }

        db.query(query, values, (err, result) => {
            if (err) return res.status(500).json({ message: "Erro ao atualizar usuário." });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado." });
            res.json({ message: "Usuário atualizado com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar senha." });
    }
});

module.exports = router;
