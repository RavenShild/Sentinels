import bcrypt from "bcryptjs"; // Use "bcryptjs" no lugar de "bcrypt"

// Simulação de um hash armazenado no banco de dados
const hashedPassword = "$10$miPEAOj.fE6uAVAa7YT/Wu9yHEiW9dSVTtCe1Pa67IoeLDEayC72y"; // Exemplo de hash

// Senha inserida pelo usuário
const senhaDigitada = "teste";

// Verifica se a senha digitada corresponde ao hash armazenado
bcrypt.compare(senhaDigitada, hashedPassword).then((result) => {
    if (result) {
        console.log("✅ Senha correta!");
    } else {
        console.log("❌ Senha incorreta!");
    }
}).catch(err => console.error("Erro ao comparar a senha:", err));
