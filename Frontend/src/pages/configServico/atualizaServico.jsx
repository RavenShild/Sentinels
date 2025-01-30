import React, { useEffect, useState } from "react";
import '../../css/geral.css';
import Navbar from "../../components/navbar/navbar";
import dbConfig from "../../components/util/dbConfig";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import estiloAtualizar from "./atualiza.module.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Footer from "../../components/footer/footer";

export default function AtualizarServico() {
    const [id, setId] = useState(null);
    const [data, setData] = useState("");
    const [sgtNomeGuerra, setSgtNomeGuerra] = useState("");
    const [cbNomeGuerra, setCbNomeGuerra] = useState("");
    const [motoristaNomeGuerra, setMotoristaNomeGuerra] = useState("");
    const [nomeCompleto, setNomeCompleto] = useState("");

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Usuário não autenticado.");

                const response = await axios.get(`${dbConfig()}/usuario/dados`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });

                setNomeCompleto(response.data.nome_completo);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                toast.error("Erro ao carregar os dados do usuário.");
            }
        };

        fetchUsuario();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${dbConfig()}/config_servico/servico_configurado`);
                const servico_vigor = res.data[0];

                setId(servico_vigor.id);
                setData(format(new Date(servico_vigor.servico_ref), 'yyyy-MM-dd'));
                setSgtNomeGuerra(nomeCompleto || servico_vigor.sgtNomeGuerra);
                setCbNomeGuerra(servico_vigor.cbNomeGuerra);
                setMotoristaNomeGuerra(servico_vigor.motoristaNomeGuerra || "");
            } catch (err) {
                toast.error(err);
            }
        };

        fetchData();
    }, [nomeCompleto]);

    const handleRegistrarSubmit = async (event) => {
        event.preventDefault();

        const dados = {
            dataServico: data,
            sgtNomeGuerra: sgtNomeGuerra,
            cbNomeGuerra: cbNomeGuerra,
            motoristaNomeGuerra: motoristaNomeGuerra && motoristaNomeGuerra.trim() !== "" ? motoristaNomeGuerra : null,
        };

        try {
            const response = id ? await axios.put(`${dbConfig()}/config_servico/${id}`, dados)
                : await axios.post(`${dbConfig()}/config_servico`, dados);

            const responseData = response.data;

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: responseData.message,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success btn-lg',
                    }
                });
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mb-5">
                <div className="d-flex align-items-center justify-content-center mt-4 p-0 d-print-none">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/home">Página Inicial</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Atualizar Serviço
                            </li>
                        </ol>
                    </nav>
                </div>

                <h1 className="mt-2 text-center">Atualizar Serviço</h1>
                <p className="mt-3 text-center">Esta página proporciona a edição dos membros da guarnição de serviço, possibilitando a correção da data em que o serviço estará em vigor.</p>

                <form className="row g-3 was-validated mt-4" id="needs-validation">
                    <h4>Data do serviço</h4>

                    <div className="col-md-3">
                        <label htmlFor="data-servico" className="form-label">Data do serviço</label>
                        <input
                            type="date"
                            className="form-control"
                            id="data-servico"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="sgt-nome-guerra" className="form-label">Comandante da Guarda</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sgt-nome-guerra"
                            maxLength="100"
                            value={sgtNomeGuerra}
                            disabled
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="cb-nome-guerra" className="form-label">Cabo da guarda</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cb-nome-guerra"
                            maxLength="100"
                            value={cbNomeGuerra}
                            onChange={(e) => setCbNomeGuerra(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="motorista-nome-guerra" className="form-label">Motorista de dia</label>
                        <input
                            type="text"
                            className="form-control"
                            id="motorista-nome-guerra"
                            maxLength="100"
                            value={motoristaNomeGuerra}
                            onChange={(e) => setMotoristaNomeGuerra(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button className="btn btn-success" onClick={handleRegistrarSubmit} type="submit">Salvar</button>
                    <Link to="/home" className={`${estiloAtualizar.botao_cancelar}`}><button className={`${estiloAtualizar.botao_cancelar} btn btn-danger`} type="button">Cancelar</button></Link>
                </form>
            </div>
            <Footer />
        </>
    );
}