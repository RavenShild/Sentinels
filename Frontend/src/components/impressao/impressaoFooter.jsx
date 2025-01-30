import React, { useEffect, useState } from "react";
import impressaoEstilo from "./css/impressao.module.css";
import { getLatestConfigServicoId } from "../configServico/configServico";

export default function ImpressaoFooter() {
    const [dataServico, setDataServico] = useState(null);
    const [dataAmanha, setDataAmanha] = useState('');
    const [nomeComandante, setNomeComandante] = useState('');

    useEffect(() => {
        const fetchDataServico = async () => {
            try {
                const dataConfig = await getLatestConfigServicoId();
                if (!dataConfig.servico_ref) {
                    throw new Error("Nenhuma configuração encontrada.");
                }

                setDataServico(dataConfig.servico_ref);
                setNomeComandante(dataConfig.sgtNomeGuerra); // Nome do Comandante da Guarda

            } catch (error) {
                alert('Erro ao obter a configuração do serviço: ' + error.message);
            }
        };

        fetchDataServico();
    }, []);

    useEffect(() => {
        if (dataServico) {
            let amanha = new Date(dataServico);
            amanha.setDate(amanha.getDate() + 1); // Adiciona um dia
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
