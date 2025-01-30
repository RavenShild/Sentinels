import React from "react";
import botaoEstilo from "./botao.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPenToSquare, faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";

export function NovoRegistro(props) {
    return (
        <Link to={props.link} className={`btn btn-md ${botaoEstilo.btn_registro} ${botaoEstilo.bnt_base}`}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {props.titulo}
        </Link>
    );
}

export function NovoRegistro2() {
    return (
        <button type="button" className={`btn btn-md ${botaoEstilo.btn_registro} ${botaoEstilo.bnt_base}`} data-bs-toggle="modal" data-bs-target="#novoRegistro">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Novo Registro
        </button>
    );
}

export function EditarRegistros(props) {
    return (
        <button type="button" className={`btn btn-md ${botaoEstilo.btn_registro} ${botaoEstilo.bnt_base}`} onClick={props.click}>
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Editar Registros
        </button>
    );
}

export function PaginaInicial(props) {
    return (
        <Link to="/" className={`btn btn-md me-2 ${botaoEstilo.paginaIncial} ${botaoEstilo.bnt_base}`}>
            <FontAwesomeIcon icon={faHouse} className="me-2" />
            {props.titulo}
        </Link>
    );
}

export function Voltar(props) {
    return (
        <Link to={props.link} className="btn btn-secondary btn-md">
            <i className="fa-solid fa-arrow-left"></i> Voltar
        </Link>
    );
}

export function Cancelar(props) {
    return (
        <Link to={props.link} className="btn btn-success w-100 mt-2">
            Cancelar
        </Link>
    );
}

export function Imprimir(props) {
    const tipo = props.impressao;
    function teste(tipo) {
        if (tipo === 'paisagem') {
            return (
                <div className="alert alert-primary mt-2 d-print-none" role="alert">
                    Recomenda-se imprimir esta pagina em paisagem.
                </div>
            );
        } else {
            return (
                <div className="alert alert-primary mt-2 d-print-none" role="alert">
                    Recomenda-se imprimir esta pagina em retrato.
                </div>);
        }
    }

    return (
        <>
            <button
                className={`btn btn-md btn-primary d-print-none ${props.classe}`}
                onClick={() => window.print()}
            >
                <FontAwesomeIcon icon={faPrint} /> Imprimir
            </button>
            {teste(tipo)}
        </>

    );
}