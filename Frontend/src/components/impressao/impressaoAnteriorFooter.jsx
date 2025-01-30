import React, { useEffect, useState } from "react";
import impressaoEstilo from "./css/impressao.module.css";
import { getConfigServicoByDate } from "../configServico/configServico";

export default function ImpressaoAnteriorFooter() {
    const [dataServico, setDataServico] = useState(null);
    const [dataAmanha, setDataAmanha] = useState('');
    const [nomeComandante, setNomeComandante] = useState('');
    
    // Pega a data salva no LocalStorage
    const selectedDate = localStorage.getItem('selectedDate');

    useEffect(() => {
        const fetchDataServico = async () => {
            try {
                const dataConfig = await getConfigServicoByDate(selectedDate); // Busca pelo serviço da data específica
                if (!dataConfig.servico_ref) {
                    throw new Error("Nenhuma configuração encontrada.");
                }

                setDataServico(dataConfig.servico_ref);
                setNomeComandante(dataConfig.sgtNomeGuerra); 

            } catch (error) {
                alert('Erro ao obter a configuração do serviço: ' + error.message);
            }
        };

        fetchDataServico();
    }, [selectedDate]);

    useEffect(() => {
        if (dataServico) {
            let amanha = new Date(dataServico);
            amanha.setDate(amanha.getDate() + 1); // Mantendo a lógica original de +2 dias
            setDataAmanha(amanha.toLocaleDateString('pt-BR'));
        }
    }, [dataServico]);

    return (
        <div className="d-none d-print-block text-center">
            <p>Quartel em Bagé - RS, {dataAmanha}.</p>
            <div className="d-flex justify-content-center">
                <div className={`${impressaoEstilo.underline} ${impressaoEstilo.impressao_margem}`}></div>
            </div>
            <p className="text-center">{nomeComandante || 'Não informado'} - Comandante da Guarda</p>
        </div>
    );
}
