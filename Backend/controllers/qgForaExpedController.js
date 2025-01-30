const express = require("express");
const db = require("./dbConfig");

const router = express.Router();

// Rota para ler (Read) os dados a serem exibidos para o usuário
router.get("/qg_fora_expediente", (req, res) => {
    const sql = "SELECT  pfe.id, pfe.pg, pfe.nomeGuerra, pfe.idtMil, pfe.dataEntrada, pfe.horaEntrada, pfe.horaSaida, pfe.origem FROM qg_fora_expediente pfe INNER JOIN config_servico cs ON pfe.config_servico_id = cs.id WHERE cs.configurado = 1 ORDER BY pfe.dataEntrada, pfe.horaEntrada";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para ler (Read) os dados a serem exibidos para o usuário em serviço anterior
router.get("/servico_anterior_qg_fora_expediente", (req, res) => {
    const sql = "SELECT * FROM bk_qg_fora_expediente order by dataEntrada, horaEntrada";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para realizar novos registro de dados. (Create)
router.post("/qg_fora_expediente", (req, res) => {
    const { postoGraduacaoRegistro, nomeGuerraRegistro, idtMilitarRegistro, dataEntradaRegistro, horaEntradaRegistro, horaSaidaRegistro, origemRegistro, servConfigID } = req.body;
    const sql = "INSERT INTO qg_fora_expediente (pg, nomeGuerra, idtMil, dataEntrada, horaEntrada, horaSaida, origem, config_servico_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    // Validação dos dados
    if (!postoGraduacaoRegistro || !nomeGuerraRegistro || !idtMilitarRegistro || !dataEntradaRegistro || !origemRegistro) {
        return res.status(400).json({ message: "Existem campos obrigatórios!", status: 400 });
    }

    db.query(sql, [postoGraduacaoRegistro, nomeGuerraRegistro, idtMilitarRegistro, dataEntradaRegistro, horaEntradaRegistro, horaSaidaRegistro, origemRegistro, servConfigID], (err, result) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json({ message: "Dados inseridos com sucesso!" });
    });
});

// Rota para selecionar os dados por ID
router.get("/qg_fora_expediente/selectId/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM qg_fora_expediente WHERE id = ?"; // Consulta SQL para buscar o registro pelo ID
    db.query(sql, id, (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) {
            return res.json({ message: "Registro não encontrado" });
        }
        return res.json(data[0]); // Retorna o primeiro registro encontrado (se houver)
    });
});

// Rota para atualizar dados (UPDATE)
router.put("/qg_fora_expediente/:id", (req, res) => {
    const id = req.params.id;
    const { pg, nomeGuerra, idtMil, dataEntrada, horaEntrada, horaSaida, origem } = req.body;

    // Validação dos dados
    if (!pg || !nomeGuerra || !idtMil || !dataEntrada || !origem) {
        return res.status(400).json({ message: "Existem campos obrigatórios!", status: 400});
    }

    const sql = "UPDATE qg_fora_expediente SET pg=?, nomeGuerra=?, idtMil=?, dataEntrada=?, horaEntrada=?, horaSaida=?, origem=? WHERE id=?";


    db.query(sql, [pg, nomeGuerra, idtMil, dataEntrada, horaEntrada, horaSaida, origem, id], (err, result) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    });
});


// Rota para deletar dados.
router.delete("/qg_fora_expediente/:id", (req, res) => {
    const civisId = req.params.id;
    const sql = `DELETE FROM qg_fora_expediente WHERE id = ?`;
    db.query(sql, civisId, (err, result) => {
        if (err) return res.json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Registro não encontrado" });
        }
        return res.json({ message: "Registro deletado com sucesso" });
    });
});

module.exports = router;