import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Estilo from "./consulta.module.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import axios from "axios";

import "../../../css/estiloTabela.css";
import Navbar from "../../../components/navbar/navbar";
import dbConfig from "../../../components/util/dbConfig";
import Footer from "../../../components/footer/footer";

export default function RelatorioServicoAnterior() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        // Função para buscar as datas disponíveis do back-end
        const fetchAvailableDates = async () => {
            try {
                const response = await axios.get(`${dbConfig()}/config_servico_dates`);
                const dates = Array.isArray(response.data) ? response.data.map(item => {
                    const date = new Date(item.servico_ref);
                    return !isNaN(date) ? date.toISOString().split('T')[0] : null;
                }).filter(date => date !== null) : [];
                setAvailableDates(dates);
            } catch (error) {
                console.error("Erro ao buscar as datas disponíveis:", error);
                setAvailableDates([]);
            }
        };
        
        // Chama a função para buscar as datas disponíveis
        fetchAvailableDates();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date.toISOString().split('T')[0]); // Converte para formato YYYY-MM-DD
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Salva a data no localStorage
        localStorage.setItem('selectedDate', selectedDate);

        window.location.href = "/relatorio_servico_anterior/consulta_servico_anterior";
    };

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
                            Consulta ao serviço anterior
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="container mb-5">
                <p className="text-center d-print-none">Consulta ao serviço anterior</p>
                <p className="text-center d-print-none pb-5">Escolha a data do serviço</p>

                <div className={`d-flex align-items-center justify-content-center m-auto mt-5 ${Estilo.card}`}>
                    <form onSubmit={handleFormSubmit} className="d-print-none">
                        <div className="form-group mt-5">
                            <Calendar
                                onChange={(date) => handleDateChange(date)}
                                tileDisabled={({ date }) => !availableDates.includes(date.toISOString().split('T')[0])}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3 w-100">Consultar</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
