import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import dbConfig from "../../components/util/dbConfig";
import "../../css/geral.css";

export default function EditarUsuario() {
    const [usuarios, setUsuarios] = useState([]); // Lista de usuários
    const [formData, setFormData] = useState({
        id: "", 
        usuario: "", 
        nomeCompleto: "", 
        administrador: "0", 
        novaSenha: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Buscar a lista de usuários cadastrados
        fetch(`${dbConfig()}/usuarios`)
            .then((res) => res.json())
            .then((data) => setUsuarios(data))
            .catch((error) => console.error("Erro ao carregar usuários:", error));
    }, []);

    // Quando o usuário seleciona um nome, buscamos os dados desse usuário no banco
    const handleUserSelect = (e) => {
        const selectedUserId = e.target.value;
        if (!selectedUserId) return;

        fetch(`${dbConfig()}/usuarios/${selectedUserId}`)
            .then((res) => res.json())
            .then((data) => setFormData({ ...data, novaSenha: "" })) // Preenche os campos
            .catch((error) => console.error("Erro ao buscar usuário:", error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${dbConfig()}/usuarios/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Swal.fire("Sucesso!", "Usuário atualizado com sucesso!", "success");
                navigate("/usuarios");
            } else {
                Swal.fire("Erro!", "Não foi possível atualizar o usuário.", "error");
            }
        } catch (error) {
            Swal.fire("Erro!", "Erro ao enviar requisição.", "error");
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h1 className="text-center">
                    <FontAwesomeIcon icon={faEdit} className="me-2" /> Editar Usuário
                </h1>
                <div className="card mx-auto mt-4" style={{ maxWidth: "600px" }}>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="was-validated">
                            
                            {/* 🔽 SELEÇÃO DE USUÁRIO 🔽 */}
                            <div className="mb-3">
                                <label className="form-label">Selecionar Usuário</label>
                                <select className="form-select" onChange={handleUserSelect} required>
                                    <option value="">Escolha um usuário...</option>
                                    {usuarios.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.usuario} - {user.nome_completo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 🔽 CAMPOS AUTOMATICAMENTE PREENCHIDOS 🔽 */}
                            <div className="mb-3">
                                <label className="form-label">Usuário</label>
                                <input type="text" name="usuario" className="form-control" value={formData.usuario} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nome Completo</label>
                                <input type="text" name="nomeCompleto" className="form-control" value={formData.nomeCompleto} onChange={handleChange} required />
                            </div>
                            
                            {/* 🔽 CAMPO PARA NOVA SENHA 🔽 */}
                            <div className="mb-3">
                                <label className="form-label">Nova Senha</label>
                                <input type="password" name="novaSenha" className="form-control" value={formData.novaSenha} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nível de Acesso</label>
                                <select name="administrador" className="form-select" value={formData.administrador} onChange={handleChange}>
                                    <option value="0">Comandante da Guarda</option>
                                    <option value="1">Administrador (E2)</option>
                                    <option value="2">Super Administrador (STI)</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-success w-100">Salvar Alterações</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
