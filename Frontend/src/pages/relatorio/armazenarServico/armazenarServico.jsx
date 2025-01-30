import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import "../../../css/estiloTabela.css";

import Navbar from "../../../components/navbar/navbar";
import clearForm from "../../../components/util/clearForm";
import dbConfig from "../../../components/util/dbConfig";
import { Cancelar } from "../../../components/botao/botao";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../../../components/footer/footer";

export default function ArmazenarServico() {
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef(null);
    const isLoadingRef = useRef(isLoading); // Usado para manter o valor mais recente de isLoading

    // Atualiza a referência sempre que isLoading muda
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    const handleFinalizarServico = () => {
        setIsLoading(true); // Ativa o estado de carregamento

        // Exibe o SweetAlert2 com um temporizador, barra de progresso e botão de cancelar
        Swal.fire({
            title: "Finalizando serviço...",
            html: "O serviço será finalizado em <b></b> segundos.",
            timer: 5000,
            timerProgressBar: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            customClass: {
                cancelButton: 'btn btn-danger btn-lg',
            },
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getHtmlContainer().querySelector("b");
                timeoutRef.current = setInterval(() => {
                    timer.textContent = (Swal.getTimerLeft() / 1000).toFixed(1);
                }, 100);
            },
            willClose: () => {
                clearInterval(timeoutRef.current);
                timeoutRef.current = null;
                setIsLoading(false);
            }
        }).then(async (result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                // Se o temporizador fechar o alerta
                if (isLoadingRef.current) {
                    try {
                        const response = await axios.put(`${dbConfig()}/finaliza_servico`, {}, {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });

                        Swal.fire({
                            title: 'Sucesso!',
                            text: response.data.message,
                            icon: 'success',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-success btn-lg',
                            }
                        }).then(() => {
                            window.location.href = "/configServico";
                        });

                    } catch (error) {
                        console.error("Erro:", error);
                        Swal.fire({
                            title: 'Erro',
                            text: 'Ocorreu um erro ao finalizar o serviço.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger btn-lg',
                            }
                        });
                    } finally {
                        setIsLoading(false);
                        isLoadingRef.current = false;
                    }
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Se o usuário clicar no botão de cancelar
                Swal.fire({
                    title: 'Cancelado',
                    text: 'A operação foi cancelada com sucesso.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success btn-lg',
                    }
                });
            }
        });
    };

    return (
        <>
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                <i className="fa-solid fa-triangle-exclamation"></i> Atenção!{" "}
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Os dados ficarão disponíveis apenas para consulta e impressão no Menu <strong>Serviço Anterior</strong>.
                        </div>
                        <div className="modal-footer">

                            <button className="btn btn-danger" onClick={handleFinalizarServico} disabled={isLoading}>
                                {isLoading ? "Finalizando..." : "Finalizar Serviço"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Fechar
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <Navbar />
            <div className="container mb-5">
                <div className="d-flex align-items-center justify-content-center mt-4 p-0 d-print-none">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/home">Página Inicial</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Amazenamento de Serviço
                            </li>
                        </ol>
                    </nav>
                </div>
                <h4 className="text-center d-print-none">Finalizar Serviço</h4>
                <div className="w-50 m-auto">
                    <p className="text-justify">
                        O Menu "Finalizar Serviço" é uma ferramenta extremamente delicada.
                        Ao utilizá-lo, você estará arquivando suas informações atuais,
                        tornando-as disponíveis <strong>apenas</strong> para consulta e
                        impressão no Menu "Serviço Anterior".
                    </p>
                </div>
                <div className="w-50 m-auto">
                    <button
                        type="button"
                        className="btn btn-danger w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        Finalizar Serviço
                    </button>
                    <Cancelar link="/home" />
                </div>
            </div>

            <Footer />
        </>
    );
}
