import React from "react";
import cardEstilo from './card.module.css';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGear, faPowerOff, faCar } from "@fortawesome/free-solid-svg-icons";

export function CardCivis(props) {
    return <Link to={props.link} className={`btn ${cardEstilo.card_base} ${cardEstilo.civis} me-3`}><p>{props.titulo}</p></Link>
}

export function CardMilitares(props) {
    return <Link to={props.link} className={`btn ${cardEstilo.card_base} ${cardEstilo.mil} me-3`}><p>{props.titulo}</p></Link>
}

export function CardOutrasOm(props) {
    return <Link to={props.link} className={`btn ${cardEstilo.card_base} ${cardEstilo.outrasOm} me-3`}><p>{props.titulo}</p></Link>
}

export function CardRelatorio(props) {
    return <Link to={props.link} className={`btn ${cardEstilo.card_base} ${cardEstilo.relatorio} me-3`}><p>{props.titulo}</p></Link>
}

export function CardViaturas(props) {
    return <Link to={props.link} className={`btn fs-1 ${cardEstilo.card_base} ${cardEstilo.fichavtr} me-3`}><FontAwesomeIcon icon={props.icone} /></Link>
}