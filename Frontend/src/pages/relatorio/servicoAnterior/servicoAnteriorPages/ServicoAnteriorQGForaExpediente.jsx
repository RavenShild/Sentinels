import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import ImpressaoHeader from "../../../../components/impressao/impressaoAnteriorHeader";
import ImpressaoFooter from "../../../../components/impressao/impressaoAnteriorFooter";
import estiloImpressao from "../../../../components/impressao/css/PrintPortrait.module.css";
import "../../../../css/estiloTabela.css";

import Navbar from "../../../../components/navbar/navbar";
import { Imprimir } from "../../../../components/botao/botao";
import { formatDate, formatTime } from "../../../../components/util/formatDateTime";
import dbConfig from "../../../../components/util/dbConfig";
import axios from "axios";

export default function ServicoAnteriorQGForaExpediente() {
    const selectedDate = localStorage.getItem('selectedDate');

    // Estado para receber os dados gravados no BD
    const [data, setData] = useState([]);

    // Função interna para buscar os dados da API e atualizar o estado 'data'
    const fetchData = async () => {

        try {
            const response = await axios.get(`${dbConfig()}/servico_anterior_qg_fora_expediente/${selectedDate}`);
            setData(response.data);
        } catch (error) {
            console.error("Erro ao buscar os serviços:", error);
        }
    };

    // Este useEffect será executado após a montagem inicial do componente
    useEffect(() => {
        // Chama a função fetchData para buscar dados da API e atualizar o estado 'data'
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="d-flex align-items-center justify-content-center mt-4 p-0 d-print-none">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/home">Página Inicial</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/relatorio_servico_anterior">Serviço Anterior</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <Link to="/relatorio_servico_anterior/consulta_servico_anterior">Consulta ao dia {formatDate(selectedDate)}</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Entrada e saída de militares durante o horário de expediente do dia
                        </li>
                    </ol>
                </nav>
            </div>
            <p className="text-center d-print-none">Entrada e saída de militares durante o horário de expediente do dia {formatDate(selectedDate)}</p>

            <div
                className={`container d-flex flex-column justify-content-center align-items-center ${estiloImpressao.container_local}`}
            >
                <ImpressaoHeader titulo="Entrada e saída de militares durante o horário de expediente" />

                <table className="table text-center table-bordered border-dark table-hover">
                    <thead>
                        <tr>
                            <th scope="col">PG</th>
                            <th scope="col">Nome Guerra</th>
                            <th scope="col">Idt Mil</th>
                            <th scope="col">Data</th>
                            <th scope="col">Entrada</th>
                            <th scope="col">Saída</th>
                            <th scope="col">Origem/Destino</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((dados) => {
                            let id = dados.id;
                            return (
                                <tr key={dados.id} className="align-middle">
                                    <td>{dados.pg}</td>

                                    <td>{dados.nomeGuerra}</td>

                                    <td>{dados.idtMil}</td>
                                    <td>{formatDate(dados.dataEntrada)}</td>
                                    <td>
                                        {dados.horaEntrada === null || dados.horaEntrada === '00:00:00' ? '- - -' : formatTime(dados.horaEntrada)}
                                    </td>
                                    <td>
                                        {dados.horaSaida === null || dados.horaSaida === '00:00:00' ? '- - -' : formatTime(dados.horaSaida)}
                                    </td>
                                    <td>{dados.origem}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Imprimir impressao="retrato" />
                <ImpressaoFooter />
            </div>

        </>
    );
}
