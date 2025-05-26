/* Verifica se o usuário está logado ao carregar a página */
function verificarLogin() {
    // Verifica se existe um usuário logado no localStorage
    if (!localStorage.getItem("logado")) {
        alert("Você precisa fazer login!");
        // Redireciona para a página de login
        window.location.href = "index.html";
    }
}

/* Salva um novo pedido */
function salvarPedido() {
    // Obtém os dados do formulário
    let nome = document.getElementById("nome").value.trim();
    let quantidade = document.getElementById("quantidade").value.trim();
    let valor = document.getElementById("valor").value.trim();
    let pagamento = document.getElementById("pagamento").checked ? "Pago" : "Aguardando pagamento";

    // Verifica se todos os campos estão preenchidos
    if (!nome || !quantidade || !valor) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Carrega os pedidos do localStorage
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    // Gera um ID único para o novo pedido
    let id = pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1;

    // Adiciona o novo pedido ao array
    pedidos.push({ id, nome, quantidade, valor, pagamento });

    // Salva os pedidos atualizados no localStorage
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Exibe mensagem de sucesso
    alert("Pedido salvo com sucesso!");

    // Limpa o formulário
    document.getElementById("nome").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("pagamento").checked = false;
}

/* Abre a página de pedidos em uma nova aba */
function abrirPedidos() {
    // Abre a página pedidos.html em uma nova aba
    window.open("pedidos.html", "_blank");
}

/* Realiza o logout do usuário */
function logout() {
    // Remove o usuário logado do localStorage
    localStorage.removeItem("logado");
    // Redireciona para a página de login
    window.location.href = "index.html";
}