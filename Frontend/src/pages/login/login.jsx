import React, { useState } from "react";
import axios from "axios";
import estiloLogin from "./login.module.css";
import logo from "../../assets/img/cav.png";
import { verificarAutenticacao } from "../../components/autenticacao/autenticacao";
import dbConfig from "../../components/util/dbConfig";
import { toast } from "react-toastify";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const response = await axios.post(`${dbConfig()}/login`, {
        usuario: usuario.trim(),
        senha: senha
      });

      if (response.data.token) {
        // Salva o token no localStorage
        localStorage.setItem("token", response.data.token);

        // Busca a configuração do serviço
        let configServicoConfigurado = 0;
        try {
          const responseConfig = await axios.get(`${dbConfig()}/config_servico`);
          const configuracoes = responseConfig.data;

          if (configuracoes.length > 0) {
            configServicoConfigurado = configuracoes[configuracoes.length - 1].configurado;
          }
        } catch (configError) {
          console.warn("Erro ao buscar configurações do serviço:", configError);
        }

        // Verifica a autenticação e obtém o nível de acesso
        const userRole = await verificarAutenticacao();

        if (userRole !== null) {
          toast.success("Logado com sucesso!");

          // Aguarda um tempo antes de redirecionar
          setTimeout(() => {
            if (configServicoConfigurado === 1) {
              window.location.href = "/home";
            } else {
              window.location.href = "/configServico";
            }
          }, 2000);
        } else {
          toast.error("Erro na autenticação, tente novamente.");
        }
      } else {
        toast.error("Usuário ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Falha na autenticação, verifique suas credenciais.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className={estiloLogin.login_container}>
        <p className="text-center mt-0 fs-5 bold">
          <strong>Quartel-general da 3ª Brigada de Cavalaria Mecanizada</strong>
        </p>
        <div className={estiloLogin.form}>
          <div className={estiloLogin.logo_container}>
            <div className="d-flex flex-column align-items-center">
              <img src={logo} className={estiloLogin.logo} alt="Logo" />
            </div>
          </div>

          <form className={estiloLogin.login_form} onSubmit={handleLogin}>
            <h6 className="position-absolute bottom-0 end-0 me-3 mb-3">
              Versão: 01.00
            </h6>

            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">
                Usuário
              </label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                placeholder="Insira seu nome de usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
