import React, { useState } from "react";

import logoNav from "../../assets/img/Cav.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGear, faPowerOff, faCar } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [autenticado, setAutenticado] = useState(false);

  const logout = () => {
    // Limpar os dados de autenticação ao fazer logout
    localStorage.removeItem("token");
    setAutenticado(false);
    // Redirecionar para a página de login após o logout
    return (window.location.href = "/");
  };

  return (
    <nav className="navbar navbar-expand bg-body-tertiary shadow d-print-none">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          <img src={logoNav} alt="HOME" width={80} />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item d-flex">
              <Link to="/manual" className="nav-link">
                <FontAwesomeIcon icon={faBook} /> Manual
              </Link>
            </li>

            {/*
            <li className="nav-item d-flex">
              <Link to="/ficha_viaturas" className="nav-link">
                <FontAwesomeIcon icon={faCar} /> Ficha de viatura
              </Link>
            </li>
            */}    

            <li className="nav-item d-flex">
              <Link to="/atualizaServico" className="nav-link">
                <FontAwesomeIcon icon={faGear} /> Configuração do Serviço
              </Link>
            </li>
            <li className="nav-item d-flex">
              <button className="nav-link text-danger" onClick={logout}>
                {" "}
                <FontAwesomeIcon icon={faPowerOff} /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
