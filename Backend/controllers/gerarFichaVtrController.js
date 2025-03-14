const express = require("express");
const db = require("./dbConfig");

const router = express.Router();


// Rota para ler (Read) os dados a serem exibidos para o usuário
router.get("/ficha_viatura", (req, res) => {
    // const sql = "SELECT  cv.id, cv.nome, cv.cnh, cv.placa, cv.dataEntrada, cv.horaEntrada, cv.horaSaida, cv.destino FROM civis_veiculo cv INNER JOIN config_servico cs ON cv.config_servico_id = cs.id WHERE cs.configurado = 1 ORDER BY cv.dataEntrada, cv.horaEntrada";
    const sql = "SELECT * FROM ficha_viatura ORDER BY data DESC, horaSaida ASC";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


/*
// Rota para ler (Read) os dados a serem exibidos para o usuário em serviço anterior
router.get("/servico_anterior_civis_veiculo", (req, res) => {
    const sql = "SELECT * FROM bk_civis_veiculo order by dataEntrada, horaEntrada";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});
*/

// Rota para selecionar os dados por ID
router.get("/ficha_viatura/selectId/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM ficha_viatura WHERE id = ?"; // Consulta SQL para buscar o registro pelo ID
    db.query(sql, id, (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) {
            return res.json({ message: "Registro não encontrado" });
        }
        return res.json(data[0]); // Retorna o primeiro registro encontrado (se houver)
    });
});

// Rota para realizar novos registro de dados.
router.post("/ficha_viatura", (req, res) => {
    const { velMax, viatura, placaEb, data, motorista, apresentarse, porOrdem, itinerario, horaSaida, odmSaida, combustivel, naturezaSv } = req.body;
    const sql = "INSERT INTO ficha_viatura (velMax, viatura, eb, data, motNome, apresentarse, porOrdem, itinerario, horaSaida, odmSaida, combustivel, naturezaSv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Validação dos dados
    if (!velMax || !viatura || !placaEb || !data || !motorista || !apresentarse || !porOrdem || !itinerario || !horaSaida || !odmSaida || !combustivel || !naturezaSv) {
        return res.status(400).json({ message: "Todos os campos obrigatórios!", status: 400 });
    }

    db.query(sql, [velMax, viatura, placaEb, data, motorista, apresentarse, porOrdem, itinerario, horaSaida, odmSaida, combustivel, naturezaSv], (err, result) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json({ message: "Ficha registrada, pronta para consulta!" });
    });
});

// Rota para atualizar dados
router.put("/ficha_viatura/:id", (req, res) => {
    const id = req.params.id;
    const { apresentarse, chVtr, combustivel, dataSaida, eb, horaSaida, itinerario, motNome, naturezaSv, odmSaida, porOrdem, velMax, viatura } = req.body;
    //const sql = "UPDATE civis_veiculo SET nome=?, cnh=?, placa=?, dataEntrada=?, horaEntrada=?, horaSaida=?, destino=? WHERE id=?";
    const sql = "UPDATE ficha_viatura SET apresentarse=?, chVtr=?, combustivel=?, data=?, eb=?, horaSaida=?, itinerario=?, motNome=?, naturezaSv=?, odmSaida=?, porOrdem=?, velMax=? ,viatura=? WHERE id=?";
    
    
    // Validação dos dados
    /*
    if (!nome || !cnh || !placa || !dataEntrada || !horaEntrada || !destino || !horaSaida) {
        return res.status(400).json({ message: "Existem campos obrigatórios!", status: 400 });
    }
    */

    db.query(sql, [apresentarse, chVtr, combustivel, dataSaida, eb, horaSaida, itinerario, motNome, naturezaSv, odmSaida, porOrdem, velMax, viatura, id], (err, result) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    });
});

/*
// Rota para deletar dados.
router.delete("/civis_veiculo/:id", (req, res) => {
    const civisId = req.params.id;
    const sql = `DELETE FROM civis_veiculo WHERE id = ?`;
    db.query(sql, civisId, (err, result) => {
        if (err) return res.json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Registro não encontrado" });
        }
        return res.json({ message: "Registro deletado com sucesso" });
    });
});

*/

module.exports = router;