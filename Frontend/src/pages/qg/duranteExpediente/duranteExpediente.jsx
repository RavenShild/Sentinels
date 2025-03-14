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
import estiloImpressao from "../../../components/impressao/css/PrintPortrait.module.css";
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

export default function QGDuranteExpediente() {
    // Estado para receber os dados gravados no BD
    const [data, setData] = useState([]);

    // Função para buscar dados da API e atualizar o estado 'data'
    const fetchData = async () => {
        try {
            // Faz uma requisição para buscar dados da API em http://localhost:8081/qg_durante_expediente
            const res = await fetch(`${dbConfig()}/qg_durante_expediente`);

            // Converte a resposta da requisição para o formato JSON
            const fetchedData = await res.json();

            // Atualiza o estado 'data' do componente com os dados obtidos da API
            setData(fetchedData);
        } catch (err) {
            // Em caso de erro na requisição, exibe um alerta e imprime o erro no console
            alert(err)
            console.log(err);
        }
    };

    // Este useEffect será executado após a montagem inicial do componente
    useEffect(() => {
        // Chama a função fetchData para buscar dados da API e atualizar o estado 'data'
        fetchData();
    }, []);

    // Registro do civil pelo modal:
    const handleRegistrarSubmit = async (event) => {
        event.preventDefault();
    
        let servConfigID;
        try {
            const configId = await getLatestConfigServicoId();
            servConfigID = configId.id;
            if (!servConfigID) {
                throw new Error("Nenhuma configuração encontrada.");
            }
        } catch (error) {
            toast.error(error);
            return;
        }
    
        // Captura os valores do formulário
        const postoGraduacaoRegistro = document.getElementById('pg').value;
        const nomeGuerraRegistro = document.getElementById('nome-guerra').value;
        const idtMilitarRegistro = document.getElementById('idt-mil').value;
        const horaEntradaRegistro = document.getElementById('hora-entrada').value;
        const horaSaidaRegistro = document.getElementById('hora-saida').value;
        const origemRegistro = document.getElementById('origem').value;
    
        // Define a data atual automaticamente
        const dataAtual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
        const dados = {
            postoGraduacaoRegistro,
            nomeGuerraRegistro,
            idtMilitarRegistro,
            dataEntradaRegistro: dataAtual,  // Data fixa
            horaEntradaRegistro: horaEntradaRegistro && horaEntradaRegistro.trim() !== "" ? horaEntradaRegistro : null,
            horaSaidaRegistro: horaSaidaRegistro && horaSaidaRegistro.trim() !== "" ? horaSaidaRegistro : null,
            origemRegistro,
            servConfigID,
        };
    
        try {
            const response = await fetch(`${dbConfig()}/qg_durante_expediente`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });
    
            const responseData = await response.json();
    
            if (responseData.status !== 400) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `${responseData.message}`,
                    showConfirmButton: false,
                    timer: 2000
                });
    
                clearForm();
                fetchData();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: responseData.message,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            toast.error(error);
        }
    };

    // Utilidades para o modal de EDIÇÃO / ATUALIZAÇÃO
    const [id, setId] = useState([]);
    const [pg, setPG] = useState([]);
    const [nomeGuerra, setNomeGuerra] = useState([]);
    const [idtMil, setIdtMil] = useState([]);
    const [dataEntrada, setDataEntrada] = useState([]);
    const [horaEntrada, setHoraEntrada] = useState([]);
    const [horaSaida, setHoraSaida] = useState([]);
    const [origem, setOrigem] = useState([]);
    // Busca de dados por Id para a edição
    const buscarDadosPorId = async (id) => {
        try {
            const response = await axios.get(`${dbConfig()}/qg_durante_expediente/selectId/${id}`);
            const data = response.data;
    
            const editModal = new bootstrap.Modal(document.getElementById("editarRegistro"));
    
            if (data) {
                // Formata a data de entrada para o formato 'YYYY-MM-DD'
                const dataEntradaFormatada = format(new Date(data.dataEntrada), 'yyyy-MM-dd');
    
                setId(data.id || "");
                setPG(data.pg || "");
                setNomeGuerra(data.nomeGuerra || "");
                setIdtMil(data.idtMil || "");
                setDataEntrada(dataEntradaFormatada); // Mantém a data original
                setHoraEntrada(data.horaEntrada || "");
                setHoraSaida(data.horaSaida || "");
                setOrigem(data.origem || "");
    
                editModal.show();
            }
    
        } catch (error) {
            toast.error(error);
        }
    };

    // Ao clicar no botão atualizar dados do modal de edição essa função será executada
    const atualizarDadosPorId = async (id) => {
        try {
            const response = await axios.put(`${dbConfig()}/qg_durante_expediente/${id}`, {
                pg,
                nomeGuerra,
                idtMil,
                dataEntrada, // Mantém a data original
                horaEntrada: horaEntrada && horaEntrada.trim() !== "" ? horaEntrada : null,
                horaSaida: horaSaida && horaSaida.trim() !== "" ? horaSaida : null,
                origem
            });
    
            if (response.data.status !== 400) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `${response.data.message}`,
                    showConfirmButton: false,
                    timer: 2000
                });
    
                fetchData();
            }
    
            return response.data;
        } catch (error) {
            const mensagem = error.response.data.message;
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
            const response = await fetch(`${dbConfig()}/qg_durante_expediente/${id}`, {
                method: 'DELETE', // Utiliza o método DELETE para indicar a exclusão do recurso
            });

            // Converte a resposta da requisição para JSON
            const data = await response.json();

            await fetchData();

            // Exibe um alerta da mensagem retornada após a exclusão (mensagem de sucesso ou erro)
            //  alert(data.message);
        } catch (error) {
            // Em caso de erro na requisição, Exibe um alerta
            //  alert('Erro:', error)
            toast.error(error);
        }
    };

    // Função executada ao clicar no botao Deletar
    const handleDeleteRegistro = (id, pg, nomeGuerra) => {
        Swal.fire({
            title: 'Tem certeza de que deseja excluir este registro?',
            html: `PG: ${pg} <br> Nome: ${nomeGuerra}`,
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
    const handleDeleteRegistro = (id, pg, nomeGuerra) => {
        // Exibe um diálogo de confirmação ao usuário, mostrando os detalhes do registro que será excluído
        const shouldDelete = window.confirm(
            `Tem certeza de que deseja excluir este registro? PG: ${pg} Nome: ${nomeGuerra}`
        );

        if (shouldDelete) {
            // Chama a função de exclusão se o usuário confirmar
            deleteRegistro(id);
        }
    };*/

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
                            Militares durante o horário de expediente
                        </li>
                    </ol>
                </nav>
            </div>
            <p className="text-center d-print-none">Entrada e saída de militares durante o horário de expediente.</p>
            <div className="text-center mb-4 d-print-none">
                <NovoRegistro2 />
            </div>
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
                            <th scope="col" className="d-print-none">
                                Ação
                            </th>
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
                                        {dados.horaEntrada === null ? '- - -' : formatTime(dados.horaEntrada)}
                                    </td>
                                    <td>
                                        {dados.horaSaida === null ? '- - -' : formatTime(dados.horaSaida)}
                                    </td>
                                    <td>{dados.origem}</td>

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
                                                        handleDeleteRegistro(id, dados.pg, dados.nomeGuerra)
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
                <Imprimir impressao="retrato" />
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
                                    <label className="form-label" htmlFor="pg">Posto Graduação</label>
                                    <select className="form-select" id="pg" required>
                                    <option value="">Selecione</option>
                                    <option value="Gen Ex">General de Exército</option>
                                    <option value="Gen Div">General de Divisão</option>
                                    <option value="Gen Bda">General de Brigada</option>
                                    <option value="Cel">Coronel</option>
                                    <option value="TC">Tenente-coronel</option>
                                    <option value="Maj">Major</option>
                                    <option value="Cap">Capitão</option>
                                    <option value="1º Ten">1º Tenente</option>
                                    <option value="2º Ten">2º Tenente</option>
                                    <option value="Asp">Aspirante a oficial</option>
                                    <option value="ST">Subtenente</option>
                                    <option value="1º Sgt">1º Sargento</option>
                                    <option value="2º Sgt">2º Sargento</option>
                                    <option value="3º Sgt">3º Sargento</option>
                                    <option value="Cb">Cabo</option>
                                    <option value="Sd EP">Soldado Efetivo Profissional</option>
                                    <option value="Sd EV">Soldado Efetivo Variável</option>
                                    <option value="Al NPOR">Aluno NPOR</option>
                                    <option value="Al CFST">Aluno CFST</option>
                                    </select>
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="nome-guerra" className="form-label">
                                        Nome de guerra
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Insira o nome de guerra"
                                        id="nome-guerra"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="idt-mil" className="form-label">
                                        Identidade Militar
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="idt-mil"
                                        placeholder="N° da identidade"
                                        name="idt-mil"
                                        maxLength="50"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="data-entrada" className="form-label">
                                        Data de Entrada
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="data-entrada"
                                        value={new Date().toISOString().split('T')[0]} // Data atual
                                        readOnly // Impede edição
                                    />
                                </div>


                                <div className="col-md-3">
                                    <label htmlFor="hora-entrada" className="form-label">
                                        Horário de Entrada
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-entrada"
                                        placeholder="Insira o horário de entrada"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="hora-saida" className="form-label">
                                        Horário de Saída
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-saida"
                                        placeholder="Insira o horário de saída"
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="origem" className="form-label">
                                        Origem / Destino
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="origem"
                                        placeholder="Insira a Origem / Destino"
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
                        <div className="status"></div>
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
                                    <label className="form-label" htmlFor="pg">Posto Graduação</label>
                                    <select className="form-select" id="pg" value={pg.toString()} onChange={(e) => setPG(e.target.value)}>
                                        <option value="">Selecione</option>
                                        <option value="Gen Ex">General de Exército</option>
                                        <option value="Gen Div">General de Divisão</option>
                                        <option value="Gen Bda">General de Brigada</option>
                                        <option value="Cel">Coronel</option>
                                        <option value="TC">Tenente-coronel</option>
                                        <option value="Maj">Major</option>
                                        <option value="Cap">Capitão</option>
                                        <option value="1º Ten">1º Tenente</option>
                                        <option value="2º Ten">2º Tenente</option>
                                        <option value="Asp">Aspirante a oficial</option>
                                        <option value="ST">Subtenente</option>
                                        <option value="1º Sgt">1º Sargento</option>
                                        <option value="2º Sgt">2º Sargento</option>
                                        <option value="3º Sgt">3º Sargento</option>
                                        <option value="Cb">Cabo</option>
                                        <option value="Sd EP">Soldado Efetivo Profissional</option>
                                        <option value="Sd EV">Soldado Efetivo Variável</option>
                                        <option value="Al NPOR">Aluno NPOR</option>
                                        <option value="Al CFST">Aluno CFST</option>
                                    </select>
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="nome-guerra" className="form-label">
                                        Nome de guerra
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Insira o nome de guerra"
                                        id="nome-guerra"
                                        required
                                        value={nomeGuerra}
                                        onChange={(e) => setNomeGuerra(e.target.value)}
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="idtMil" className="form-label">
                                        Identidade Militar
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="idtMil"
                                        placeholder="N° da Identidade Militar"
                                        maxLength="14"
                                        value={idtMil}
                                        onChange={(e) => setIdtMil(e.target.value)}
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="data-entrada" className="form-label">
                                        Data de Entrada
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="data-entrada"
                                        value={dataEntrada} // Mantém a data original
                                        readOnly // Impede edição
                                    />
                                </div>

                                <div className="col-md-3">
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

                                <div className="col-md-3">
                                    <label htmlFor="hora-saida" className="form-label">
                                        Horário de Saída
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="hora-saida"
                                        placeholder="Insira o horário de entrada"
                                        value={horaSaida}
                                        onChange={(e) => setHoraSaida(e.target.value)}
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-warning bg-gradient text-black">Campo opcional.</div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="origem" className="form-label">
                                        Origem / Destino
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="origem"
                                        placeholder="Insira a origem / destino"
                                        value={origem}
                                        onChange={(e) => setOrigem(e.target.value)}
                                        required
                                    />
                                    <div className="valid-feedback rounded text-center bg-success text-light">OK!</div>
                                    <div className="invalid-feedback rounded text-center bg-danger text-light">Campo obrigatório.</div>
                                </div>

                                <div className="col-md-6"></div>
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
