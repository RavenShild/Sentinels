import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import dbConfig from "../util/dbConfig.jsx";
import { verificarAutenticacao } from "../autenticacao/autenticacao.jsx";
import ProtectedRoute from "../protect/ProtectedRoute.jsx";

import Login from "../../pages/login/login.jsx";
import ErroPage from "../../pages/erros/erros.jsx";
import HomePage from "../../pages/homepage/home.jsx";

import Civis from "../../pages/civis/civis.jsx";
import Veiculo from "../../pages/civis/civis_veiculo/veiculo.jsx"

import QGDuranteExped from "../../pages/qg/duranteExpediente/duranteExpediente.jsx";
import QGForaExped from "../../pages/qg/foraExpediente/foraExpediente.jsx";
import QGViatura from "../../pages/qg/viatura/viatura_qg.jsx"

import OutraOmDuranteExpediente from "../../pages/outraOm/duranteExpediente/oomDuranteExpediente.jsx";
import OutraOmForaExpediente from "../../pages/outraOm/foraExpediente/oomForaExpediente.jsx";
import OutraOmViatura from "../../pages/outraOm/viatura/viatura_oom.jsx"
import Visitantes from "../../pages/visitantes/visitantes.jsx";

import CadastroMil from "../../pages/admin/cadastroMil.jsx";
import CadastroUsuario from "../../pages/admin/cadastroUsuario.jsx";
import EditarUsuario from "../editarUsuario/usuarios.jsx";

import ArmazenarServico from "../../pages/relatorio/armazenarServico/armazenarServico.jsx";
import RelatorioServicoAnterior from "../../pages/relatorio/servicoAnterior/servicoAnterior.jsx";
import ServicoAnteriorCivisRegistro from "../../pages/relatorio/servicoAnterior/servicoAnteriorPages/ServicoAnteriorCivisRegistro.jsx";

import ServicoAnteriorQGDuranteExpediente from "../../pages/relatorio/servicoAnterior/servicoAnteriorPages/ServicoAnteriorQGDuranteExpediente.jsx";
import ServicoAnteriorQGForaExpediente from "../../pages/relatorio/servicoAnterior/servicoAnteriorPages/ServicoAnteriorQGForaExpediente.jsx";

import ServicoAnteriorOutraOmDuranteExpediente from "../../pages/relatorio/servicoAnterior/servicoAnteriorPages/ServicoAnteriorOutraOmDuranteExpediente.jsx";
import ServicoAnteriorOutraOmForaExpediente from "../../pages/relatorio/servicoAnterior/servicoAnteriorPages/ServicoAnteriorOutraOmForaExpediente.jsx";

import Manual from "../../pages/manual/manual.jsx";
import ConfigServico from "../../pages/configServico/configServico.jsx";
import AtualizarServico from "../../pages/configServico/atualizaServico.jsx";
import RelatorioConsulta from "../../pages/relatorio/servicoAnterior/consulta.jsx";

export default function Rotas() {
    const [userRole, setUserRole] = useState(null);
    const [configurado, setConfigurado] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const verificarEAutenticar = async () => {
            try {
                const role = await verificarAutenticacao();
                setUserRole(role !== null ? role : -1); // 🔹 Evita que o valor fique `null`

                const { data: configuracoes } = await axios.get(`${dbConfig()}/config_servico/servico_configurado`);
                setConfigurado(configuracoes.length > 0 ? configuracoes[0].configurado : null);
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
            } finally {
                setCarregando(false);
            }
        };

        verificarEAutenticar();
    }, []);

    if (carregando) {
        return (
            <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/manual" element={<Manual />} />
                <Route path="/unauthorized" element={<ErroPage />} />

                {/* Proteção de Configuração */}
                <Route path="/configServico" element={userRole !== -1 && configurado !== 0 ? <ConfigServico /> : <ErroPage />} />
                <Route path="/atualizaServico" element={userRole !== -1 ? (configurado === 1 ? <AtualizarServico /> : <ConfigServico />) : <ErroPage />} />

                {/* Proteção da Home */}
                <Route path="/home" element={
                    <ProtectedRoute allowedRoles={[0, 1, 2]}>
                        <HomePage />
                    </ProtectedRoute>
                } />

                {/* Rotas acessíveis por COMUNS, ADMINS e SUPERADMINS */}
                {[
                    { path: "/civis", component: <Civis /> },
                    { path: "/civis_veiculo", component: <Veiculo /> },
                    { path: "/durante_expediente", component: <QGDuranteExped />},
                    { path: "/fora_expediente", component: <QGForaExped />},
                    { path: "/viatura_qg", component: <QGViatura />},
                    { path: "/outra_om_durante_expediente", component: <OutraOmDuranteExpediente />},
                    { path: "/outra_om_fora_expediente", component: <OutraOmForaExpediente />},
                    { path: "/viatura_oom", component: <OutraOmViatura />},
                    { path: "/relatorio_armazenar_servico", component: <ArmazenarServico />},
                    { path: "/relatorio_servico_anterior", component: <RelatorioServicoAnterior />},
                    { path: "/relatorio_servico_anterior/civis_registro", component: <ServicoAnteriorCivisRegistro />},
                    { path: "/relatorio_servico_anterior/qg_durante_expediente", component: <ServicoAnteriorQGDuranteExpediente />},
                    { path: "/relatorio_servico_anterior/qg_fora_expediente", component: <ServicoAnteriorQGForaExpediente />},
                    { path: "/relatorio_servico_anterior/outra_om_durante_expediente", component: <ServicoAnteriorOutraOmDuranteExpediente />},
                    { path: "/relatorio_servico_anterior/outra_om_fora_expediente", component: <ServicoAnteriorOutraOmForaExpediente />},
                    { path: "/relatorio_servico_anterior/consulta_servico_anterior", component: <RelatorioConsulta />},
                ].map(({ path, component }) => (
                    <Route key={path} path={path} element={
                        <ProtectedRoute allowedRoles={[0, 1, 2]}>
                            {component}
                        </ProtectedRoute>
                    } />
                ))}

                {/* Rotas acessíveis apenas por SUPERADMIN */}
                {[
                    { path: "/cadastroMil", component: <CadastroMil /> },
                    { path: "/cadastroUsuario", component: <CadastroUsuario /> },
                    { path: "/usuarios", component: <EditarUsuario /> },  
                    { path: "/editarUsuario/:id", component: <EditarUsuario /> }, 
                ].map(({ path, component }) => (
                    <Route key={path} path={path} element={
                        <ProtectedRoute allowedRoles={[2]}>
                            {component}
                        </ProtectedRoute>
                    } />
                ))}
            </Routes>
        </BrowserRouter>
    );
}
