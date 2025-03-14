import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importação para decodificar o token
import logoNav from "../../assets/img/soldierNav.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faGear, faPowerOff, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [autenticado, setAutenticado] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há um token no localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken?.role); // Define a role do usuário
        setAutenticado(true);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setUserRole(null);
        setAutenticado(false);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setAutenticado(false);
    navigate("/"); // Redireciona sem recarregar a página
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow d-print-none">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          <img src={logoNav} alt="HOME" width={220} height={120} />
        </Link>

        {/* Botão de menu para mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className={`collapse navbar-collapse ${menuAberto ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Todos os usuários podem ver o Manual */}
            <li className="nav-item">
              <Link to="/manual" className="nav-link">
                <FontAwesomeIcon icon={faBook} /> Manual
              </Link>
            </li>

            {/* Apenas usuários que NÃO são Role === 1 podem ver Configuração do Serviço */}
            {userRole !== 1 && (
              <li className="nav-item">
                <Link to="/atualizaServico" className="nav-link">
                  <FontAwesomeIcon icon={faGear} /> Configuração do Serviço
                </Link>
              </li>
            )}

            {/* Se estiver autenticado, exibe o botão de logout */}
            {autenticado && (
              <li className="nav-item">
                <button className="btn btn-link nav-link text-danger" onClick={logout}>
                  <FontAwesomeIcon icon={faPowerOff} /> Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
