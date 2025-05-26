/* Gera dados aleatórios para os gráficos de fundo */
function randomData() {
    // Cria um array com 5 números aleatórios entre 0 e 100
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
}

/* Cria um gráfico genérico com o tipo especificado */
function createChart(id, type) {
    // Obtém o contexto do canvas pelo ID
    const ctx = document.getElementById(id).getContext("2d");
    // Cria um novo gráfico com Chart.js
    return new Chart(ctx, {
        type: type, // Tipo do gráfico (bar, pie, line)
        data: {
            // Rótulos para os dados
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{
                // Dados aleatórios para o gráfico
                data: randomData(),
                // Cores dos elementos do gráfico
                backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#2ecc71"],
            }],
        },
        options: {
            // Torna o gráfico responsivo
            responsive: true,
            // Mantém a proporção do gráfico
            maintainAspectRatio: false,
            // Esconde a legenda
            plugins: { legend: { display: false } },
        },
    });
}

/* Cria os gráficos de fundo ao carregar a página */
const charts = {
    chart1: createChart("chart1", "bar"),
    chart2: createChart("chart2", "pie"),
    chart3: createChart("chart3", "line"),
};

/* Atualiza os dados dos gráficos a cada 5 segundos */
setInterval(() => {
    // Itera sobre cada gráfico
    Object.keys(charts).forEach((id) => {
        // Atualiza os dados com novos valores aleatórios
        charts[id].data.datasets[0].data = randomData();
        // Atualiza o gráfico na tela
        charts[id].update();
    });
}, 5000);

/* Realiza o login do usuário */
function login() {
    // Obtém o e-mail inserido pelo usuário
    let email = document.getElementById("emailLogin").value.trim();
    // Obtém a senha inserida pelo usuário
    let senha = document.getElementById("senhaLogin").value.trim();

    // Verifica se os campos estão preenchidos
    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    // Carrega os usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Verifica se existe um usuário com o e-mail e senha fornecidos
    let usuarioValido = usuarios.find((user) => user.email === email && user.senha === senha);

    // Se o usuário for válido, realiza o login
    if (usuarioValido) {
        // Salva o e-mail do usuário logado no localStorage
        localStorage.setItem("logado", email);
        // Redireciona para a página correspondente (admin ou registro)
        window.location.href = email === "admin@admin.com" ? "admin.html" : "registro.html";
    } else {
        // Exibe mensagem de erro se as credenciais forem inválidas
        alert("Usuário ou senha incorretos!");
    }
}