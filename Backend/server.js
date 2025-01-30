const express = require("express");
const cors = require("cors");
const verificarPermissao = require("./middlewares/authMiddleware.js");

// Criando a instância do Express
const app = express();

// Configuração do CORS
const corsOptions = {
    origin: ["http://192.168.0.7:5173", "http://localhost:5173"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware para permitir JSON no body das requisições

// Importação de controllers organizados
const controllers = {
    login: require("./controllers/loginController.js"),
    configuracao: require("./controllers/configuracaoServicoController.js"),
    civis: require("./controllers/civisController.js"),
    qgDuranteExp: require("./controllers/qgDuranteExpedController.js"),
    qgForaExp: require("./controllers/qgForaExpedController.js"),
    outraOmDuranteExped: require("./controllers/outraOmDuranteExpedController.js"),
    outraOmForaExped: require("./controllers/outraOmForaExpedController.js"),
    servicoAnterior: require("./controllers/servicoAnteriorController.js"),
    cadastroUsuario: require("./controllers/cadastroUsuarioController.js"),
    editarUsuario: require("./controllers/editarUsuarioController.js"), // ✅ Adicionando o novo controller
};

// Rota de status do servidor
app.get("/", (req, res) => res.json("Servidor ativo!"));

// Registro automático dos controllers
Object.entries(controllers).forEach(([name, controller]) => {
    console.log(`✅ Controller carregado: ${name}`);
    app.use("/", controller);
});

// Rota protegida para verificar autenticação
app.get("/recursoProtegido", verificarPermissao([0, 1, 2]), (req, res) => {
    res.status(200).json({ message: "Acesso permitido ao recurso protegido" });
});

// Rota protegida para cadastrar militares (somente SuperAdmins)
app.post("/cadastroMil", verificarPermissao([2]), async (req, res) => {
    const { postoGraduacao, identidadeMilitar, nomeCompleto, nomeGuerra } = req.body;

    if (!postoGraduacao || !identidadeMilitar || !nomeCompleto || !nomeGuerra) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
        const db = require("./controllers/dbConfig.js");
        const query = `INSERT INTO militares_qg (posto_graduacao, idt_mil, nome_completo, nome_guerra) VALUES (?, ?, ?, ?)`;

        await new Promise((resolve, reject) => {
            db.query(query, [postoGraduacao, identidadeMilitar, nomeCompleto, nomeGuerra], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        res.status(201).json({ message: "Militar cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar o militar:", error);
        res.status(500).json({ message: "Erro ao cadastrar militar. Tente novamente mais tarde." });
    }
});

// Inicialização do servidor
const PORT = 8081;
app.listen(PORT, () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR");
    console.log(`✅ Servidor iniciado em ${formattedDate} na porta ${PORT}`);
});

module.exports = app;
