const express = require("express");
const db = require("./dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();
const JWT_SECRET = "seuSegredoSuperSecreto"; // ⚠️ Idealmente, isso deve estar em uma variável segura

router.post("/login", async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
        }

        // Busca o usuário no banco
        const query = `SELECT * FROM usuarios WHERE usuario = ?`;
        db.query(query, [usuario], async (err, result) => {
            if (err) {
                console.error("Erro no banco de dados:", err);
                return res.status(500).json({ error: "Erro interno do servidor" });
            }

            if (result.length === 0) {
                return res.status(401).json({ error: "Usuário ou senha inválidos" });
            }

            const usuarioDb = result[0];

            // Verifica a senha corretamente
            const senhaCorreta = await bcrypt.compare(senha, usuarioDb.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ error: "Usuário ou senha inválidos" });
            }

            // ✅ Garantir que `role` seja corretamente definido, inclusive quando for `0`
            const role = usuarioDb.administrador; // ⚠️ Mudamos para pegar diretamente sem verificações erradas
            const id = usuarioDb.id;

            console.log(`Usuário autenticado: ${usuario}, ID: ${id}, Role: ${role}`); // ✅ Log para verificar os valores

            try {
                // Criar token JWT de forma segura
                const token = jwt.sign(
                    { id: id, usuario: usuario, role: role }, // ✅ Agora inclui `id` no payload
                    JWT_SECRET,
                    { expiresIn: "2h" }
                );

                return res.status(200).json({ token });
            } catch (jwtError) {
                console.error("Erro ao criar o token JWT:", jwtError);
                return res.status(500).json({ error: "Erro ao gerar autenticação" });
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
