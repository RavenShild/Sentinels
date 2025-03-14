const express = require("express");
const db = require("./dbConfig");
const router = express.Router();

// Rota para ler (Read) os dados a serem exibidos para o usuário
router.get("/outra_om_viatura", (req, res) => {
    const sql = "SELECT ov.id, ov.vtr, ov.dataRegistro, ov.horaEntrada, ov.horaSaida, ov.motorista, ov.identidade_motorista, ov.chefeVtr, ov.identidade_chefe_vtr, ov.destino FROM oom_viatura ov INNER JOIN config_servico cs ON ov.config_servico_id = cs.id WHERE cs.configurado = 1 ORDER BY ov.dataRegistro, ov.horaEntrada";
    
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para ler (Read) os dados a serem exibidos para o usuário em serviço anterior
router.get("/servico_anterior_outra_om_viatura", (req, res) => {
    const sql = "SELECT * FROM bk_oom_viatura ORDER BY dataRegistro, horaEntrada";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Rota para realizar novos registros de dados (Create)
router.post("/outra_om_viatura", (req, res) => {
    const { vtrRegistro, dataRegistro, horaSaidaRegistro, horaEntradaRegistro, motoristaRegistro, identidadeMotorista, chefeVtrRegistro, identidadeChefeVtr, destinoRegistro, servConfigID } = req.body;
    
    const sql = "INSERT INTO oom_viatura (vtr, dataRegistro, horaSaida, horaEntrada, motorista, identidade_motorista, chefeVtr, identidade_chefe_vtr, destino, config_servico_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    if (!vtrRegistro || !dataRegistro || !motoristaRegistro || !destinoRegistro || !servConfigID || !identidadeMotorista) {
        return res.status(400).json({ message: "Existem campos obrigatórios!", status: 400 });
    }

    db.query(sql, [vtrRegistro, dataRegistro, horaSaidaRegistro, horaEntradaRegistro, motoristaRegistro, identidadeMotorista, chefeVtrRegistro, identidadeChefeVtr, destinoRegistro, servConfigID], (err, result) => {
        if (err) return res.status(500).json({ message: "Erro ao inserir dados no banco de dados.", error: err });
        return res.status(200).json({ message: "Dados inseridos com sucesso!" });
    });
});

// Rota para selecionar os dados por ID
router.get("/outra_om_viatura/selectId/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM oom_viatura WHERE id = ?";
    db.query(sql, id, (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) {
            return res.json({ message: "Registro não encontrado" });
        }
        return res.json(data[0]);
    });
});

// Rota para atualizar dados (Update)
router.put("/outra_om_viatura/:id", (req, res) => {
    const id = req.params.id;
    const { vtr, dataRegistro, horaSaida, horaEntrada, motorista, identidadeMotorista, chefeVtr, identidadeChefeVtr, destino } = req.body;

    if (!vtr || !dataRegistro || !motorista || !destino || !identidadeMotorista) {
        return res.status(400).json({ message: "Existem campos obrigatórios!", status: 400 });
    }

    const sql = "UPDATE oom_viatura SET vtr=?, dataRegistro=?, horaSaida=?, horaEntrada=?, motorista=?, identidade_motorista=?, chefeVtr=?, identidade_chefe_vtr=?, destino=? WHERE id=?";
    
    db.query(sql, [vtr, dataRegistro, horaSaida, horaEntrada, motorista, identidadeMotorista, chefeVtr, identidadeChefeVtr, destino, id], (err, result) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    });
});

// Rota para deletar dados (Delete)
router.delete("/outra_om_viatura/:id", (req, res) => {
    const civisId = req.params.id;
    const sql = "DELETE FROM oom_viatura WHERE id = ?";
    db.query(sql, civisId, (err, result) => {
        if (err) return res.json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Registro não encontrado" });
        }
        return res.json({ message: "Registro deletado com sucesso" });
    });
});

module.exports = router;
