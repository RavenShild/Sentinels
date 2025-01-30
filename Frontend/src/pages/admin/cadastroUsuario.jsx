import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import dbConfig from "../../components/util/dbConfig";
import bcrypt from "bcryptjs";
import "../../css/geral.css";

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
    nomeCompleto: "",
    administrador: "0", // Valor padrão: 0 (usuário comum)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Criptografando a senha antes de enviar para o backend
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(formData.senha, salt);

      const response = await fetch(`${dbConfig()}/cadastroUsuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: formData.usuario,
          senha: senhaCriptografada,
          nomeCompleto: formData.nomeCompleto,
          administrador: formData.administrador,
        }),
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
        setFormData({ usuario: "", senha: "", nomeCompleto: "", administrador: "0" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro no cadastro",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível realizar o cadastro. Tente novamente.",
      });
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center">Cadastro de Usuário</h1>
        <div className="card mx-auto mt-4" style={{ maxWidth: "600px" }}>
          <div className="card-header text-center">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Novo Usuário
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="was-validated">
              <div className="mb-3">
                <label htmlFor="usuario" className="form-label">Usuário</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  className="form-control"
                  required
                  value={formData.usuario}
                  onChange={handleChange}
                  placeholder="Digite o nome de usuário"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  className="form-control"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Digite a senha"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="nomeCompleto" className="form-label">P/G + Nome de Guerra</label>
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
              </div>

              <div className="mb-3">
                <label htmlFor="administrador" className="form-label">Nível de Acesso</label>
                <select
                  id="administrador"
                  name="administrador"
                  className="form-select"
                  required
                  value={formData.administrador}
                  onChange={handleChange}
                >
                  <option value="0">Comandante da Guarda</option>
                  <option value="1">Administrador (E2)</option>
                  <option value="2">Super Administrador (STI)</option>
                </select>
              </div>

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
