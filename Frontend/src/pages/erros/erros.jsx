import React from "react";
import ErroEstilo from "./erroPage.module.css";
import { Link } from "react-router-dom";

export default function ErroPage() {
  return (
    <div className={ErroEstilo.erro_container}>
    <Link to={`/`}>Voltar</Link>
      <h1>Conteúdo Restrito</h1>
      <p>Para acessar este conteúdo, você precisa estar logado.</p>
      <p>Faça o login para visualizar este conteúdo.</p>
      {/* Aqui você pode adicionar algumas imagens ou outros elementos */}
      <img src="https://cdn-icons-png.flaticon.com/512/4963/4963030.png" alt="Imagem 1" />
    </div>
  );
}