import React from "react";
import ministerioLogo from "../../assets/img/ministerio-logo.jpg";
import { formatDate } from "../util/formatDateTime";

export default function ImpressaoAnteriorHeader(props) {
    const selectedDate = localStorage.getItem('selectedDate');

    return (
        <>
            <div className="position-relative w-100 d-none d-print-block">
                <div className="d-flex justify-content-between">
                    <div className="border border-dark pt-5 ps-5 pe-5 text-center">
                        <div className="border-top border-dark w-100">
                            <p>Of Dia</p>
                        </div>
                    </div>
                    <div className="border border-dark pt-5 ps-5 pe-5 text-center">
                        <div className="border-top border-dark w-100">
                            <p>Adj Dia</p>
                        </div>
                    </div>
                </div>
            </div>
            <img
                src={ministerioLogo}
                width={"100px"}
                alt="sdasd"
                className="d-none d-print-block"
            />
            <div className="d-none d-print-block text-center">
                <p>
                    <b>
                        Ministério da Defesa
                        <br />
                        Exército Brasileiro
                        <br />
                        Quartel-general da 3ª Brigada de Cavalaria Mecanizada
                    </b>
                </p>

                <p>{props.titulo} do dia {formatDate(selectedDate)}.</p>
            </div>
        </>
    );
}