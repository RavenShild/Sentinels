import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/geral.css";
import Navbar from "../../components/navbar/navbar";
import dbConfig from "../../components/util/dbConfig";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function ConfigServico() {
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [dataServico, setDataServico] = useState("");
    const [cbNomeGuerra, setCbNomeGuerra] = useState("");
    const [motoristaNomeGuerra, setMotoristaNomeGuerra] = useState("");

    // Define a data atual automaticamente
    useEffect(() => {
        const hoje = new Date().toISOString().split("T")[0]; // Obtém a data no formato YYYY-MM-DD
        setDataServico(hoje);
    }, []);

    // Buscar nome completo do usuário logado
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token armazenado:", token);

                if (!token) {
                    throw new Error("Usuário não autenticado.");
                }

                const response = await axios.get(`${dbConfig()}/usuario/dados`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });

                console.log("Resposta do backend:", response.data);
                if (response.data && response.data.nome_completo) {
                    setNomeCompleto(response.data.nome_completo);
                } else {
                    throw new Error("Nome completo não encontrado na resposta");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                toast.error("Erro ao carregar os dados do usuário.");
            }
        };

        fetchUsuario();
    }, []);

    const handleRegistrarSubmit = async (event) => {
        event.preventDefault();

        const configurado = 1;
        const dados = {
            configurado,
            dataServico, // Enviando a data já preenchida automaticamente
            sgtNomeGuerra: nomeCompleto,
            cbNomeGuerra,
            motoristaNomeGuerra: motoristaNomeGuerra && motoristaNomeGuerra.trim() !== "" ? motoristaNomeGuerra : null,
        };

        try {
            const response = await axios.post(`${dbConfig()}/config_servico`, dados);

            if (response.status === 201) {
                Swal.fire({
                    title: "Sucesso!",
                    text: "Serviço configurado com sucesso!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    window.location.href = "/home";
                });
            }
        } catch (error) {
            toast.error("Erro ao salvar os dados.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="mt-4 text-center">Configuração do serviço</h1>
                <p className="mt-3 text-center">Esta página permite configurar o serviço, definindo a data e a equipe responsável.</p>
                <form className="row g-3 was-validated mt-4" onSubmit={handleRegistrarSubmit}>
                    <h4>Data do serviço</h4>
                    <div className="col-md-3">
                        <label htmlFor="data-servico" className="form-label">Data do serviço</label>
                        <input
                            type="date"
                            className="form-control"
                            id="data-servico"
                            value={dataServico}
                            readOnly // Impede que o usuário altere a data
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="sgt-nome-guerra" className="form-label">Comandante da Guarda</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sgt-nome-guerra"
                            value={nomeCompleto}
                            disabled
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="cb-nome-guerra" className="form-label">Cabo da Guarda</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cb-nome-guerra"
                            value={cbNomeGuerra}
                            onChange={(e) => setCbNomeGuerra(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="motorista-nome-guerra" className="form-label">Motorista de Dia</label>
                        <input
                            type="text"
                            className="form-control"
                            id="motorista-nome-guerra"
                            value={motoristaNomeGuerra}
                            onChange={(e) => setMotoristaNomeGuerra(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-success" type="submit">Salvar</button>
                </form>
            </div>
        </>
    );
}
