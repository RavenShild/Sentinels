const express = require("express");
const db = require("./dbConfig");
const verificarPermissao = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Rota para obter o nome completo do usuário logado
router.get("/usuario/dados", verificarPermissao([0, 1, 2]), (req, res) => {
    console.log("Usuário autenticado:", req.user); // Log para verificar se `req.user` está definido corretamente

    if (!req.user || !req.user.id) {
        return res.status(403).json({ error: "Acesso negado. Usuário não autenticado." });
    }

    const usuarioId = req.user.id;
    console.log("Buscando usuário no banco com ID:", usuarioId);

    const sql = "SELECT nome_completo FROM usuarios WHERE id = ?";
    
    db.query(sql, [usuarioId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar dados do usuário:", err);
            return res.status(500).json({ error: "Erro ao buscar dados do usuário" });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        console.log("Nome completo encontrado:", data[0].nome_completo); // Verifica se encontrou o nome completo
        return res.json({ nome_completo: data[0].nome_completo });
    });
});

// Rota para ler (Read) os dados a serem exibidos para o usuário
router.get("/config_servico", (req, res) => {
    const sql = "SELECT * FROM config_servico";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para ler (Read) os dados a serem exibidos para o usuário
router.get("/config_servico_servico_vigor", (req, res) => {
    const sql = "SELECT * FROM config_servico WHERE configurado = 1";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para ler (Read) os dados a serem exibidos para o usuário
router.get("/config_servico_dates", (req, res) => {
    const sql = "SELECT servico_ref FROM config_servico";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar as datas" });
        return res.json(data || []); // Retorna array vazio se não houver datas
    });
});

// Rota para ler (Read) os dados apenas do SERVIÇO CONFIGURADO
router.get("/config_servico/servico_configurado", (req, res) => {
    const sql = "SELECT * FROM config_servico cs WHERE cs.configurado = 1";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para realizar novos registros de dados. (Create) - QUANDO SERVIÇO NÃO ESTIVER AINDA CONFIGURADO
router.post("/config_servico", (req, res) => {
    const { configurado, dataServico, sgtNomeGuerra, cbNomeGuerra, motoristaNomeGuerra } = req.body;
 
    // Validação dos dados
    if (!configurado || !dataServico || !sgtNomeGuerra || !cbNomeGuerra) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios.", status: 400 });
    }

    const sql = "INSERT INTO config_servico (configurado, servico_ref, sgtNomeGuerra, cbNomeGuerra, motoristaNomeGuerra) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [configurado, dataServico, sgtNomeGuerra, cbNomeGuerra, motoristaNomeGuerra], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).json({ message: "Erro ao inserir os dados.", status: 500 });
        }

        return res.status(201).json({ message: "Dados inseridos com sucesso!" });
    });
});

// Rota para atualizar dados do menu "CONFIGURAÇÃO DO SERVIÇO" (UPDATE)
router.put("/config_servico/:id", (req, res) => {
    const id = req.params.id;
    const { dataServico, sgtNomeGuerra, cbNomeGuerra, motoristaNomeGuerra} = req.body;

    // Validação dos dados
    if (!dataServico) {
        return res.status(400).json({ message: "O campo Data é obrigatório", status: 400 });
    }

    const sql = "UPDATE config_servico SET servico_ref=?, sgtNomeGuerra=?, cbNomeGuerra=?, motoristaNomeGuerra=? WHERE id=?";

    db.query(sql, [dataServico, sgtNomeGuerra, cbNomeGuerra, motoristaNomeGuerra, id], (err, result) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    });
});

// Rota para "FINALIZAR O SERVIÇO" (UPDATE)
router.put("/finaliza_servico", (req, res) => {

    const sql = "UPDATE config_servico cs SET cs.configurado=0 WHERE cs.configurado=1";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json({ message: "Serviço armazenado com sucesso!" });
    });
});

// Rota para selecionar os dados por ID
router.get("/config_servico/selectId/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM config_servico WHERE id = ?"; // Consulta SQL para buscar o registro pelo ID
    db.query(sql, id, (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) {
            return res.json({ message: "Registro não encontrado" });
        }
        return res.json(data[0]); // Retorna o primeiro registro encontrado (se houver)
    });
});

// Rota para obter a última configuração de serviço
router.get("/config_servico/ultimo", (req, res) => {
    const sql = "SELECT id, configurado, servico_ref, sgtNomeGuerra FROM config_servico ORDER BY id DESC LIMIT 1";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar a última configuração do serviço" });
        if (data.length === 0) {
            return res.status(404).json({ message: "Nenhuma configuração encontrada." });
        }
        return res.json(data[0]); // Retorna o último registro encontrado
    });
});

// Rota para obter a configuração do serviço de uma data específica
router.get("/config_servico/data/:date", (req, res) => {
    const { date } = req.params;
    const sql = "SELECT id, configurado, servico_ref, sgtNomeGuerra FROM config_servico WHERE servico_ref = ? LIMIT 1";
    
    db.query(sql, [date], (err, data) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar a configuração do serviço" });
        if (data.length === 0) {
            return res.status(404).json({ message: "Nenhuma configuração encontrada para esta data." });
        }
        return res.json(data[0]); // Retorna a configuração do serviço para aquela data específica
    });
});

// Rota para deletar dados.
router.delete("/config_servico/:id", (req, res) => {
    const civisId = req.params.id;
    const sql = `DELETE FROM config_servico WHERE id = ?`;
    db.query(sql, civisId, (err, result) => {
        if (err) return res.json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Registro não encontrado" });
        }
        return res.json({ message: "Registro deletado com sucesso" });
    });
});

module.exports = router;