const express = require("express");
const db = require("./dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();
const JWT_SECRET = "seuSegredoSuperSecreto";

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

            // Verifica a senha
            const senhaCorreta = await bcrypt.compare(senha, usuarioDb.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ error: "Usuário ou senha inválidos" });
            }

            const role = usuarioDb.administrador;
            const id = usuarioDb.id;
            const nome_completo = usuarioDb.nome_completo;

            console.log(`Usuário autenticado: ${usuario}, ID: ${id}, Role: ${role}`);

            // ⚠️ VERIFICAR SE EXISTE UM SERVIÇO EM ANDAMENTO
            const queryServico = `SELECT * FROM config_servico WHERE configurado = 1 LIMIT 1`;
            db.query(queryServico, async (err, servicoResult) => {
                if (err) {
                    console.error("Erro ao verificar serviço ativo:", err);
                    return res.status(500).json({ error: "Erro ao verificar serviço ativo" });
                }

                if (servicoResult.length > 0) {
                    const servicoAtivo = servicoResult[0];

                    // Se for um usuário comum e NÃO for o responsável pelo serviço, bloqueia o login
                    if (role === 0 && nome_completo !== servicoAtivo.sgtNomeGuerra) {
                        return res.status(403).json({ error: "Acesso negado! Apenas o Comandante da Guarda resposável pelo serviço pode logar." });
                    }
                }

                // Gera o token JWT
                try {
                    const token = jwt.sign(
                        { id: id, usuario: usuario, role: role },
                        JWT_SECRET,
                        { expiresIn: "2h" }
                    );
                    
                    return res.status(200).json({ token });
                    
                } catch (jwtError) {
                    console.error("Erro ao criar o token JWT:", jwtError);
                    return res.status(500).json({ error: "Erro ao gerar autenticação" });
                }
            });
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
