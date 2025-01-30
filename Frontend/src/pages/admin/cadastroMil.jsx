import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import '../../css/geral.css';

export default function CadastroPessoas() {
  const [formData, setFormData] = useState({
    postoGraduacao: "",
    identidadeMilitar: "",
    nomeCompleto: "",
    nomeGuerra: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtém o token salvo no localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Erro de autenticação",
        text: "Sua sessão expirou. Faça login novamente.",
      });
      window.location.href = "/login"; // Redireciona para login
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/cadastroMil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 🔹 Agora envia o token corretamente
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Cadastro realizado com sucesso!",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
        });

        // Limpa o formulário apenas se o cadastro for bem-sucedido
        setFormData({
          postoGraduacao: "",
          identidadeMilitar: "",
          nomeCompleto: "",
          nomeGuerra: "",
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Erro no cadastro",
          text: result.message || "Houve um erro no servidor. Tente novamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro inesperado",
        text: "Não foi possível realizar o cadastro. Tente novamente.",
      });
      console.error("Erro ao cadastrar:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center">Cadastro de Militares</h1>
        <div className="card mx-auto mt-4" style={{ maxWidth: "600px" }}>
          <div className="card-header text-center">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Novo Cadastro
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="was-validated">
              {/* Posto/Graduação */}
              <div className="mb-3">
                <label htmlFor="postoGraduacao" className="form-label">
                  Posto/Graduação
                </label>
                <select
                  id="postoGraduacao"
                  name="postoGraduacao"
                  className="form-select"
                  required
                  value={formData.postoGraduacao}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="Gen Ex">General de Exército</option>
                  <option value="Gen Div">General de Divisão</option>
                  <option value="Gen Bda">General de Brigada</option>
                  <option value="Cel">Coronel</option>
                  <option value="TC">Tenente-coronel</option>
                  <option value="Maj">Major</option>
                  <option value="Cap">Capitão</option>
                  <option value="1º Ten">1º Tenente</option>
                  <option value="2º Ten">2º Tenente</option>
                  <option value="Asp">Aspirante a oficial</option>
                  <option value="ST">Subtenente</option>
                  <option value="1º Sgt">1º Sargento</option>
                  <option value="2º Sgt">2º Sargento</option>
                  <option value="3º Sgt">3º Sargento</option>
                  <option value="Cb">Cabo</option>
                  <option value="Sd EP">Soldado Efetivo Profissional</option>
                  <option value="Sd EV">Soldado Efetivo Variável</option>
                  <option value="Al NPOR">Aluno NPOR</option>
                  <option value="Al CFST">Aluno CFST</option>
                </select>
                <div className="invalid-feedback">Campo obrigatório.</div>
              </div>

              {/* Identidade Militar */}
              <div className="mb-3">
                <label htmlFor="identidadeMilitar" className="form-label">
                  Identidade Militar
                </label>
                <input
                  type="text"
                  id="identidadeMilitar"
                  name="identidadeMilitar"
                  className="form-control"
                  required
                  maxLength="50"
                  value={formData.identidadeMilitar}
                  onChange={handleChange}
                  placeholder="Digite a identidade militar"
                />
                <div className="invalid-feedback">Campo obrigatório.</div>
              </div>

              {/* Nome Completo */}
              <div className="mb-3">
                <label htmlFor="nomeCompleto" className="form-label">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nomeCompleto"
                  name="nomeCompleto"
                  className="form-control"
                  required
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                />
                <div className="invalid-feedback">Campo obrigatório.</div>
              </div>

              {/* Nome de Guerra */}
              <div className="mb-3">
                <label htmlFor="nomeGuerra" className="form-label">
                  Nome de Guerra
                </label>
                <input
                  type="text"
                  id="nomeGuerra"
                  name="nomeGuerra"
                  className="form-control"
                  required
                  value={formData.nomeGuerra}
                  onChange={handleChange}
                  placeholder="Digite o nome de guerra"
                />
                <div className="invalid-feedback">Campo obrigatório.</div>
              </div>

              {/* Botão de Cadastro */}
              <button type="submit" className="btn btn-success w-100">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
