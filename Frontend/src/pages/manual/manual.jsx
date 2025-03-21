import React from "react";
import '../../css/geral.css';
import estilo from "./manual.module.css";
import Navbar from "../../components/navbar/navbar";
import { jwtDecode } from "jwt-decode";

import Campos from "./assets/campos.png";
import Impressao01 from "./assets/impressao_1.png";
import Impressao02 from "./assets/impressao_2.png";
import Passagem from "./assets/passagem.png";
import ServicoAnterior from "./assets/servico_anterior.png";


export default function Manual() {
    const token = localStorage.getItem('token');
    let isAdmin = false;

    if (token) {
        // Decodificar o token para acessar as informações
        const decodedToken = jwtDecode(token);

        // Verificar se o token indica que o usuário é administrador
        isAdmin = decodedToken && decodedToken.isAdmin === 1; // 'role' é apenas um exemplo, você deve usar a chave correta no token
    }


    const decodedToken = jwtDecode(token);

    //console.log(token);
    //console.log(decodedToken.isAdmin);
    //console.log(isAdmin);

    return <>
        <Navbar />
        <div className="container mt-2">
            <h1 className="text-center">Manual do sistema</h1>
            <div className={`${estilo.container_manual} p-3 mb-4`}>
                <h4>Registro de Dados</h4>
                <p>O sistema de registro de dados possui um padrão unificado para a inserção de registros em todas as páginas. Certifique-se de observar os campos obrigatórios e opcionais ao realizar as inserções.</p>

                <div className="d-flex mb-3">
                    <img src={Campos} className={estilo.img} />
                </div>

                <h4>Impressão da Página</h4>
                <p>Ao realizar a impressão, atente-se à orientação da página para garantir que a mesma seja impressa de maneira padronizada e legível.</p>

                <div className="d-flex flex-column mb-3">
                    <img src={Impressao01} className={estilo.img} />
                </div>
                <div className="d-flex flex-column mb-3">
                    <img src={Impressao02} className={estilo.img} />
                    <figcaption className="text-center">Desabilite a opção "cabeçalhos e rodapés" para padronização do documento.</figcaption>
                </div>

                <p><b>Importante:</b>A impressão deve ser realizada apenas no dia da passagem de serviço e somente em caso de alterações ocorridas durante o serviço.</p>

                <h4>Passagem de Serviço e Recomeço</h4>
                <p>O Comandante da Guarda que está saindo de serviço é responsável por encerrar o serviço no sistema e realizar o logout. Somente após essa etapa, o Comandante da Guarda que assume o serviço deverá efetuar o login e configurar o serviço subsequente.</p>

                <div className="d-flex flex-column mb-3">
                    <img src={Passagem} className={estilo.img} />
                </div>

                <h4>Consulta ao Serviço Anterior</h4>
                <p>Após o armazenamento do serviço, o mesmo estará disponível para consulta até a passagem do próximo serviço.</p>

                <div className="d-flex flex-column mb-3">
                    <img src={ServicoAnterior} className={estilo.img} />
                </div>
            </div>
        </div>
    </>
}