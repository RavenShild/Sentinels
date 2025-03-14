import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import ImpressaoHeader from "../../../components/impressao/impressaoHeader";
import ImpressaoFooter from "../../../components/impressao/impressaoFooter";
import estiloImpressao from "../../../components/impressao/css/PrintLandscape.module.css";
import "../../../css/estiloTabela.css";

import Navbar from "../../../components/navbar/navbar";
import {
    Imprimir,
    NovoRegistro2,
} from "../../../components/botao/botao";
import clearForm from "../../../components/util/clearForm";
import { formatDate, formatTime } from "../../../components/util/formatDateTime";
import dbConfig from "../../../components/util/dbConfig";
import { getLatestConfigServicoId } from "../../../components/configServico/configServico";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Footer from "../../../components/footer/footer";

export default function OutraOmViatura() {
    // Estado para receber os dados gravados no BD
    const [data, setData] = useState([]);

    // Função para buscar dados da API e atualizar o estado 'data'
    const fetchData = async () => {
        try {
            // Faz uma requisição para buscar dados da API em http://localhost:8081/pelotao_viatura
            const res = await fetch(`${dbConfig()}/outra_om_viatura`);

            // Converte a resposta da requisição para o formato JSON
            const fetchedData = await res.json();

            // Atualiza o estado 'data' do componente com os dados obtidos da API
            setData(fetchedData);
        } catch (err) {
            // Em caso de erro na requisição, exibe um alerta e imprime o erro no console
            // alert(err)
            // console.log(err);
            toast.error(err);
        }
    };

    // Este useEffect será executado após a montagem inicial do componente
    useEffect(() => {
        // Chama a função fetchData para buscar dados da API e atualizar o estado 'data'
        fetchData();
    }, []);

    // Registro de dados pelo modal
    const handleRegistrarSubmit = async (event) => {

        // Previne o comportamento padrão do formulário ao ser submetido (evita atualziar a página)
        event.preventDefault();

        // Captura o ID da configuração do serviço em vigor
        let servConfigID;

        try {
            // Obtém a última configuração de serviço
            const configId = await getLatestConfigServicoId();
            servConfigID = configId.id;
            if (!servConfigID) {
                throw new Error("Nenhuma configuração encontrada.");
            }
        } catch (error) {
            // Em caso de erro, exibe um alerta e retorna
            toast.error('Erro ao obter a configuração do serviço: ' + error.message);
            // alert('Erro ao obter a configuração do serviço: ' + error.message);
            return;
        }

        // Coleta os valores dos campos do formulário
        const vtrRegistro = document.getElementById('vtr').value;
        const identidadeMotorista = document.getElementById('identidade-motorista').value;
        const identidadeChefeVtr = document.getElementById('identidade-chefe').value;
        const dataRegistro = document.getElementById('data-registro').value;
        const horaSaidaRegistro = document.getElementById('hora-saida').value;
        const horaEntradaRegistro = document.getElementById('hora-entrada').value;
        const motoristaRegistro = document.getElementById('motorista').value;
        const chefeVtrRegistro = document.getElementById('chefe-viatura').value;
        const destinoRegistro = document.getElementById('destino').value;

        // Organiza os dados coletados em um objeto
        const dados = {
            vtrRegistro,
            identidadeMotorista: identidadeMotorista && identidadeMotorista.trim() !== "" ? identidadeMotorista : null,
            identidadeChefeVtr: identidadeChefeVtr && identidadeChefeVtr.trim() !== "" ? identidadeChefeVtr : null,
            dataRegistro,
            horaSaidaRegistro: horaSaidaRegistro && horaSaidaRegistro.trim() !== "" ? horaSaidaRegistro : null,
            horaEntradaRegistro: horaEntradaRegistro && horaEntradaRegistro.trim() !== "" ? horaEntradaRegistro : null,
            motoristaRegistro,
            chefeVtrRegistro: chefeVtrRegistro && chefeVtrRegistro.trim() !== "" ? chefeVtrRegistro : null,
            destinoRegistro,
            servConfigID,
        };


        try {
            // Envia uma requisição POST para adicionar um novo registro
            const response = await fetch(`${dbConfig()}/outra_om_viatura`, {
                // Utiliza o método POST
                method: 'POST',
                headers: {
                    // Define o tipo de conteúdo como JSON
                    'Content-Type': 'application/json',
                },
                // Converte o objeto 'dados' para JSON e o envia no corpo da requisição
                body: JSON.stringify(dados),
            });

            // Converte a resposta da requisição para JSON
            const responseData = await response.json();

            if (responseData.status != 400) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `${responseData.message}`,
                    showConfirmButton: false,
                    timer: 2000
                });

                // Limpa o formulário após a inserção
                clearForm();
                // Atualiza os dados na tela após a inserção 
                // (supõe-se que fetchData() é uma função que busca os dados atualizados)
                await fetchData();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: responseData.message,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
            // Exibe um alerta com a mensagem recebida do servidor após a inserção
            // alert(responseData.message);
        } catch (error) {
            // Em caso de erro na requisição, exibe um alerta
            alert('Erro:', error);
        }
    };

    // Utilidades para o modal de EDIÇÃO / ATUALIZAÇÃO
    const [id, setId] = useState([]);
    const [vtr, setVtr] = useState([]);
    const [identidadeMotorista, setIdentidadeMotorista] = useState([]);
    const [identidadeChefeVtr, setIdentidadeChefeVtr] = useState([]);
    const [dataRegistro, setDataRegistro] = useState([]);
    const [horaSaida, setHoraSaida] = useState([]);
    const [horaEntrada, setHoraEntrada] = useState([]);
    const [motorista, setMotorista] = useState([]);
    const [chefeVtr, setChefeVtr] = useState([]);
    const [destino, setDestino] = useState([]);
    // Busca de dados por Id para a edição
    const buscarDadosPorId = async (id) => {
        try {
            // Faz uma requisição GET para obter os dados de um registro específico com o ID fornecido
            const response = await axios.get(`${dbConfig()}/outra_om_viatura/selectId/${id}`);
            const data = response.data;

            // Cria uma instância de um modal usando Bootstrap
            const editModal = new bootstrap.Modal(document.getElementById("editarRegistro"));

            // Verifica se há dados retornados antes de definir os estados para evitar erros
            if (data) {

                // Formata a data de entrada para o formato 'yyyy-MM-dd'
                const dataRegistro = format(new Date(data.dataRegistro), 'yyyy-MM-dd');

                // Define os estados com os dados obtidos da requisição, usando valores padrão vazios caso não haja dados
                setId(data.id || "");
                setVtr(data.vtr || "");
                setIdentidadeMotorista(data.identidade_motorista || "");
                setIdentidadeChefeVtr(data.identidade_chefe_vtr || "");
                setDataRegistro(dataRegistro || "");
                setHoraSaida(data.horaSaida || "");
                setHoraEntrada(data.horaEntrada || "");
                setMotorista(data.motorista || "");
                setChefeVtr(data.chefeVtr || "");
                setDestino(data.destino || "");

                // Mostra o modal de edição após definir os estados com os dados
                editModal.show();
            }

        } catch (error) {
            // Em caso de erro na requisição, exibe um alerta e imprime o erro no console
            // alert(error);
            // console.error("Erro ao buscar dados:", error);
            toast.error("Erro ao buscar dados:", error);
        }
    };

    // Ao clicar no botão atualizar dados do modal de edição essa função será executada
    const atualizarDadosPorId = async (id) => {
        try {
            // Envia uma requisição PUT para atualizar os dados do registro com o ID fornecido
            const response = await axios.put(`${dbConfig()}/outra_om_viatura/${id}`, {
                vtr,
                dataRegistro,
                horaSaida: horaSaida && horaSaida.trim() !== "" ? horaSaida : null,
                horaEntrada: horaEntrada && horaEntrada.trim() !== "" ? horaEntrada : null,
                motorista,
                identidadeMotorista,
                chefeVtr: chefeVtr && chefeVtr.trim() !== "" ? chefeVtr : null,
                identidadeChefeVtr,
                destino,
            });

            if (response.data.status != 400) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `${response.data.message}`,
                    showConfirmButton: false,
                    timer: 2000
                });

                fetchData();
            }

            // Exibe um alerta com a mensagem da resposta para informar o usuário sobre o resultado da operação
            // alert(response.data.message);

            // Retorna os dados da resposta da requisição
            return response.data;
        } catch (error) {
            const mensagem = error.response.data.message;
            // Em caso de erro na requisição, exibe um alerta e imprime o erro no console
            // alert(mensagem);
            Swal.fire({
                position: "center",
                icon: "error",
                title: `${mensagem}`,
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    // Função para deletar um registro pelo ID
    const deleteRegistro = async (id) => {
        // Envia uma requisição DELETE para a URL específica do ID fornecido
        try {
            const response = await fetch(`${dbConfig()}/outra_om_viatura/${id}`, {
                method: 'DELETE', // Utiliza o método DELETE para indicar a exclusão do recurso
            });

            // Converte a resposta da requisição para JSON
            const data = await response.json();

            await fetchData();

            // Exibe um alerta da mensagem retornada após a exclusão (mensagem de sucesso ou erro)
            // alert(data.message);
        } catch (error) {
            // Em caso de erro na requisição, Exibe um alerta
            toast.error(error);
            // alert('Erro:', error)
        }
    };

    // Função executada ao clicar no botao Deletar
    const handleDeleteRegistro = (id, vtr, motorista) => {
        Swal.fire({
            title: 'Tem certeza de que deseja excluir este registro?',
            html: `Motorista: ${vtr} <br> Placa / EB: ${motorista}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-primary btn-lg',
                cancelButton: 'btn btn-secondary btn-lg'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRegistro(id);
                Swal.fire({
                    title: 'Excluído!',
                    text: 'O registro foi excluído com sucesso.',
                    icon: 'success',
                    customClass: {
                        title: 'success-title',
                        popup: 'success-popup',
                        confirmButton: 'btn btn-primary btn-lg',
                        content: 'success-content'
                    }
                });
            }
        });
    };

    /*
    // Função executada ao clicar no botao Deletar
    const handleDeleteRegistro = (id, vtr, motorista) => {
        // Exibe um diálogo de confirmação ao usuário, mostrando os detalhes do registro que será excluído
        const shouldDelete = window.confirm(
            `Tem certeza de que deseja excluir este registro? Motorista: ${vtr} Placa / EB: ${motorista}`
        );

        if (shouldDelete) {
            // Chama a função de exclusão se o usuário confirmar
            deleteRegistro(id);
        }
    }; */

    return (
        <>
            <Navbar />
            <div className="d-flex align-items-center justify-content-center mt-4 p-0 d-print-none">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/home">Página Inicial</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Viaturas de outras organizações militares
                        </li>
                    </ol>
                </nav>
            </div>
            <p className="text-center d-print-none">Entrada e saída de viaturas de outras organizações militares</p>
            <div className="text-center mb-4 d-print-none">
                <NovoRegistro2 />
            </div>
            <div className={`container d-flex flex-column justify-content-center align-items-center ${estiloImpressao.container_local}`}>
                <ImpressaoHeader titulo="Entrada e saída de viaturas de outras organizações militares" />

                <table className="table text-center table-bordered border-dark table-hover">
                    <thead>
                        <tr className="align-middle">
                            <th scope="col">Vtr - OM</th>
                            <th scope="col">Data</th>
                            <th scope="col">Horário Entrada</th>
                            <th scope="col">Horário Saída</th>
                            <th scope="col">Motorista</th>
                            <th scope="col">Identidade Militar do Motorista</th>
                            <th scope="col">Chefe da Vtr</th>
                            <th scope="col">Identidade Militar do Chefe</th>
                            <th scope="col">Destino</th>
                            <th scope="col" className="d-print-none align-middle">Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((dados) => {
                            let id = dados.id;
                            return (
                                <tr key={dados.id} className="align-middle">
                                    <td>{dados.vtr}</td>
                                    <td>{formatDate(dados.dataRegistro)}</td>
                                    <td>{dados.horaEntrada ? formatTime(dados.horaEntrada) : "- - -"}</td>
                                    <td>{dados.horaSaida ? formatTime(dados.horaSaida) : "- - -"}</td>
                                    <td>{dados.motorista}</td>
                                    <td>{dados.identidade_motorista}</td>
                                    <td>{dados.chefeVtr || "- - -"}</td>
                                    <td>{dados.identidade_chefe_vtr || "- - -"}</td>
                                    <td>{dados.destino}</td>
                                    <td className="d-print-none">
                                        <div className="d-flex align-items-center justify-content-center gap-3">
                                            <div>

                                                <button className="bnt-acao" onClick={() => buscarDadosPorId(id)} >
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        color="#FFD700"
                                                    />
                                                </button>

                                            </div>
                                            <div>
                                                <button
                                                    className="bnt-acao"
                                                    onClick={() =>
                                                        handleDeleteRegistro(id, dados.motorista, dados.vtr)
                                                    }
                                                >
                                                    <FontAwesomeIcon icon={faTrash} color="#FF0000" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
                <Imprimir impressao="paisagem" />
                <ImpressaoFooter />
            </div>

            {/* MODAL Novo Registro*/}
            <div className="modal fade" id="novoRegistro" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="novoRegistroLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="novoRegistroLabel"><FontAwesomeIcon icon={faPlus} className="me-2" /> Novo Registro</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" id="modal-body">
                            <form className="row g-3 was-validated">
                                <div className="col-md-4">
                                    <label htmlFor="vtr" className="form-label">
                                        Placa / EB
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Insira a placa / EB"
                                        id="vtr"
                                        maxLength="20"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="motorista" className="form-label">
                                        Motorista
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="motorista"
                                        placeholder="Nome do motorista"
                                        maxLength="50"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="chefe-viatura" className="form-label">
                                        Chefe de Vtr
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chefe-viatura"
                                        placeholder="Nome do Ch Vtr"
                                        maxLength="50"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="data-registro" className="form-label">
                                        Data do Registro
                                    </label>
                                    <input
                                        type="date"
                                        data-format="00/00/0000"
                                        className="form-control"
                                        id="data-registro"
                                        placeholder="Insira a data de registro"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="identidade-motorista" className="form-label">
                                        Identidade Militar do Motorista
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="identidade-motorista"
                                        placeholder="Identidade Militar do Motorista"
                                        name="identidade-motorista"
                                        maxLength="20"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="identidade-chefe" className="form-label">
                                        Identidade Militar do Ch de Vtr
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="identidade-chefe"
                                        placeholder="Identidade Militar do Chefe de Viatura"
                                        name="identidade-chefe"
                                        maxLength="20"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="hora-entrada" className="form-label">
                                        Horário de Entrada
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-entrada"
                                        placeholder="Insira o horário de saida"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="hora-saida" className="form-label">
                                        Horário de Saída
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-saida"
                                        placeholder="Insira o horário de saida"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                

                                <div className="col-md-4">
                                    <label htmlFor="destino" className="form-label">
                                        Destino
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="destino"
                                        placeholder="Insira o Destino"
                                        maxLength="50"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={clearForm} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" onClick={handleRegistrarSubmit} className="btn btn-md btn-success">Registrar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL Editar Registro*/}
            <div className="modal fade" id="editarRegistro" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editarRegistroLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editarRegistroLabel"><FontAwesomeIcon icon={faPenToSquare} className="me-2" /> Editar Registro</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" id="modal-body">
                            <form className="row g-3 was-validated">
                                <div className="col-md-4">
                                    <label htmlFor="nome-guerra" className="form-label">
                                        Placa / EB
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Insira a placa / EB"
                                        id="nome-guerra"
                                        required
                                        value={vtr}
                                        onChange={(e) => setVtr(e.target.value)}
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="motorista" className="form-label">
                                        Motorista
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="motorista"
                                        placeholder="Nome do motorista"
                                        value={motorista}
                                        onChange={(e) => setMotorista(e.target.value)}
                                        maxLength="50"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="ch-vtr" className="form-label">
                                        Chefe Vtr
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ch-vtr"
                                        placeholder="Nome do Ch Vtr"
                                        value={chefeVtr}
                                        onChange={(e) => setChefeVtr(e.target.value)}
                                        maxLength="50"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="data-registro" className="form-label">
                                        Data do Registro
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="data-registro"
                                        value={dataRegistro}
                                        onChange={(e) => setDataRegistro(e.target.value)}
                                        placeholder="Insira a data de registro"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="identidade-motorista" className="form-label">
                                        Identidade Militar do Motorista
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="identidade-motorista"
                                        placeholder="Identidade Militar do Motorista"
                                        value={identidadeMotorista}
                                        onChange={(e) => setIdentidadeMotorista(e.target.value)}
                                        maxLength="20"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="identidade-chefe" className="form-label">
                                        Identidade Militar do Chefe da Vtr
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="identidade-chefe"
                                        placeholder="Identidade Militar do Chefe de Viatura"
                                        value={identidadeChefeVtr}
                                        onChange={(e) => setIdentidadeChefeVtr(e.target.value)}
                                        maxLength="20"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="hora-entrada" className="form-label">
                                        Horário de Entrada
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-entrada"
                                        placeholder="Insira o horário de entrada"
                                        value={horaEntrada}
                                        onChange={(e) => setHoraEntrada(e.target.value)}
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="hora-entrada" className="form-label">
                                        Horário de Saída
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-entrada"
                                        placeholder="Insira o horário de entrada"
                                        value={horaSaida}
                                        onChange={(e) => setHoraSaida(e.target.value)}
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                

                                <div className="col-md-4">
                                    <label htmlFor="destino" className="form-label">
                                        Destino
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="destino"
                                        placeholder="Insira o destino"
                                        value={destino}
                                        onChange={(e) => setDestino(e.target.value)}
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" onClick={(e) => atualizarDadosPorId(id)} className="btn btn-md btn-success">Atualizar Registro</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
