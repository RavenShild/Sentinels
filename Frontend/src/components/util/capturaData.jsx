export function capturaHora() {
    const date = new Date();
    const horas = String(date.getHours()).padStart(2, '0'); // Adiciona zeros à esquerda, se necessário
    const minutos = String(date.getMinutes()).padStart(2, '0'); // Adiciona zeros à esquerda, se necessário
    return `${horas}:${minutos}`;
}

export function capturaData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zeros à esquerda, se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Adiciona zeros à esquerda, o mês começa em 0 (janeiro)
    const ano = data.getFullYear();
    //return `${dia}/${mes}/${ano}`;
    return `${ano}-${mes}-${dia}`;
}

export function capturaMes() {
    const data = new Date();
    const mesExtenso = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
    return mesExtenso;
}

export function capturaAno() {
    const data = new Date();
    const ano = data.getFullYear();
    return ano;
}

export function capturaDia() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zeros à esquerda, se necessário
    return dia;
}