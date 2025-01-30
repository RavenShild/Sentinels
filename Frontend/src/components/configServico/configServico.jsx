import axios from "axios";
import dbConfig from "../util/dbConfig";

// Buscar a última configuração do serviço (para o serviço atual)
export const getLatestConfigServicoId = async () => {
    try {
        const responseConfig = await axios.get(`${dbConfig()}/config_servico/ultimo`);
        return responseConfig.data;
    } catch (error) {
        console.error("Erro ao buscar a última configuração do serviço:", error);
        return null;
    }
};

// Buscar a configuração de um serviço por data (para serviços anteriores)
export const getConfigServicoByDate = async (date) => {
    try {
        const responseConfig = await axios.get(`${dbConfig()}/config_servico/data/${date}`);
        return responseConfig.data;
    } catch (error) {
        console.error("Erro ao buscar a configuração do serviço para a data:", date, error);
        return null;
    }
};
