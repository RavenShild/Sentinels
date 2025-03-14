import React from "react";
import "../../css/geral.css";
import { CardCivis, CardMilitares, CardOutrasOm, CardRelatorio } from "../../components/card/card";
import Navbar from "../../components/navbar/navbar";
import { jwtDecode } from "jwt-decode";
import Footer from "../../components/footer/footer";

export default function HomePage() {
    const token = localStorage.getItem("token");
    let userRole = null;

    if (token) {
        const decodedToken = jwtDecode(token);
        userRole = decodedToken?.role; // 🛠 Pegamos `role` e não `isAdmin`
    }

    return (
        <>
            <Navbar />
            <div className="container mt-2">
                <h1 className="text-center">Relações da Guarda</h1>
                <hr />

                {userRole === 0 && <ComumView />}
                {userRole === 1 && <AdminView />}
                {userRole === 2 && <SuperAdminView />}
            </div>
            <Footer />
        </>
    );
}

// 📌 Componente para usuários COMUNS (e superiores)
function ComumView() {
    return (
        <>
            <h3>Civis</h3>
            <div className="d-flex mt-2">
                <CardCivis link="/civis" titulo="Registro" />
                <CardCivis link="/civis_veiculo" titulo="Veículo" />
            </div>
            <hr />

            <h3>Militares do QG</h3>
            <div className="d-flex mt-2">
                <CardMilitares link="/durante_expediente" titulo="Durante o expediente" />
                <CardMilitares link="/fora_expediente" titulo="Após o expediente" />
                <CardMilitares link="/viatura_qg" titulo="Viatura" />
            </div>
            <hr />

            <h3>Outras Organizações Militares</h3>
            <div className="d-flex mt-2">
                <CardOutrasOm link="/outra_om_durante_expediente" titulo="Durante o expediente" />
                <CardOutrasOm link="/outra_om_fora_expediente" titulo="Fora de expediente" />
                <CardOutrasOm link="/viatura_oom" titulo="Viatura" />
            </div>
            <hr />

            <h3>Relatório</h3>
            <div className="d-flex mt-2 mb-5">
                <CardRelatorio link="/relatorio_servico_anterior" titulo="Consultar serviços anteriores" />
                <CardRelatorio link="/relatorio_armazenar_servico" titulo="Finalizar Serviço" />
            </div>
        </>
    );
}

// 📌 Componente para usuários ADMINISTRADORES
function AdminView() {
    return (
        <>
            <h3>Relatório</h3>
            <div className="d-flex mt-2 mb-5">
                <CardRelatorio link="/relatorio_servico_anterior" titulo="Consultar serviços anteriores" />
            </div>
        </>
    );
}

// 📌 Componente para SUPERADMIN (acesso total)
function SuperAdminView() {
    return (
        <>
            <h3>Civis</h3>
            <div className="d-flex mt-2">
                <CardCivis link="/civis" titulo="Registro" />
                <CardCivis link="/civis_veiculo" titulo="Veículo" />
            </div>
            <hr />

            <h3>Militares do QG</h3>
            <div className="d-flex mt-2">
                <CardMilitares link="/durante_expediente" titulo="Durante o expediente" />
                <CardMilitares link="/fora_expediente" titulo="Após o expediente" />
                <CardMilitares link="/viatura_qg" titulo="Viatura" />
            </div>
            <hr />

            <h3>Outras Organizações Militares</h3>
            <div className="d-flex mt-2">
                <CardOutrasOm link="/outra_om_durante_expediente" titulo="Durante o expediente" />
                <CardOutrasOm link="/outra_om_fora_expediente" titulo="Fora de expediente" />
                <CardOutrasOm link="/viatura_oom" titulo="Viatura" />
            </div>
            <hr />

            <h3>Relatório</h3>
            <div className="d-flex mt-2 mb-5">
                <CardRelatorio link="/relatorio_servico_anterior" titulo="Consultar serviços anteriores" />
                <CardRelatorio link="/relatorio_armazenar_servico" titulo="Finalizar Serviço" />
                <CardRelatorio link="/cadastroMil" titulo="Cadastrar Militares" />
                <CardRelatorio link="/cadastroUsuario" titulo="Cadastrar Usuários" />
                <CardRelatorio link="/usuarios" titulo="Editar Usuários" />
            </div>
        </>
    );
}
