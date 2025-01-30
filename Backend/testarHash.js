const bcrypt = require("bcrypt");

async function testarHash() {
    const senhaOriginal = "teste";
    const hashGerado = await bcrypt.hash(senhaOriginal, 10);
    console.log("Hash gerado:", hashGerado);
}

testarHash();
