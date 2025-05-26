/* Carrega os pedidos e os gráficos quando a página é iniciada */
function carregarPedidos() {
    // Obtém o elemento da lista de pedidos pelo ID
    const listaPedidos = document.getElementById("listaPedidos");
    // Limpa a lista para evitar duplicações
    listaPedidos.innerHTML = "";

    // Carrega os pedidos do localStorage, ou usa um array vazio se não houver
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    // Ordena os pedidos por ID em ordem crescente
    pedidos.sort((a, b) => a.id - b.id);

    // Itera sobre os pedidos para exibi-los na lista
    pedidos.forEach((pedido) => {
        // Cria um elemento de lista para o pedido
        const li = document.createElement("li");
        // Define a classe do item para estilização
        li.className = "pedido-item";
        // Define o conteúdo HTML do item com os dados do pedido
        li.innerHTML = `
            <span>${pedido.nome} - ${pedido.quantidade}g - R$${parseFloat(pedido.valor).toFixed(2)} - <strong>${pedido.pagamento}</strong></span>
            <div class="pedido-buttons">
                <button class="btn-pago" onclick="alterarStatus(${pedido.id}, 'Pago')">Pago</button>
                <button class="btn-aberto" onclick="alterarStatus(${pedido.id}, 'Aguardando pagamento')">Em aberto</button>
                <button class="btn-excluir" onclick="excluirPedido(${pedido.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        // Adiciona o item à lista de pedidos
        listaPedidos.appendChild(li);
    });

    // Chama a função para criar os gráficos com os dados dos pedidos
    criarGraficos(pedidos);
}

/* Altera o status de um pedido específico */
function alterarStatus(id, status) {
    // Carrega os pedidos do localStorage
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    // Atualiza o status do pedido com o ID correspondente
    pedidos = pedidos.map((p) => (p.id === id ? { ...p, pagamento: status } : p));
    // Salva os pedidos atualizados no localStorage
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    // Recarrega a lista de pedidos e os gráficos
    carregarPedidos();
}

/* Exclui um pedido específico */
function excluirPedido(id) {
    // Carrega os pedidos do localStorage
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    // Remove o pedido com o ID correspondente
    pedidos = pedidos.filter((p) => p.id !== id);
    // Salva os pedidos atualizados no localStorage
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    // Recarrega a lista de pedidos e os gráficos
    carregarPedidos();
}

/* Cria os gráficos de despesas, lucros e fluxo financeiro */
function criarGraficos(pedidos) {
    // Agrupa pedidos por cliente para análise detalhada
    const pedidosPorCliente = pedidos.reduce((acc, pedido) => {
        // Inicializa o cliente no acumulador se não existir
        if (!acc[pedido.nome]) {
            acc[pedido.nome] = { pago: 0, aguardando: 0 };
        }
        // Adiciona o valor ao status correspondente
        if (pedido.pagamento === "Pago") {
            acc[pedido.nome].pago += parseFloat(pedido.valor);
        } else {
            acc[pedido.nome].aguardando += parseFloat(pedido.valor);
        }
        return acc;
    }, {});

    // Extrai os nomes dos clientes e valores para os gráficos
    const clientes = Object.keys(pedidosPorCliente);
    const valoresPagos = clientes.map((cliente) => pedidosPorCliente[cliente].pago);
    const valoresAguardando = clientes.map((cliente) => pedidosPorCliente[cliente].aguardando);

    // Calcula o total de despesas (valor a receber)
    const totalDespesas = valoresAguardando.reduce((sum, val) => sum + val, 0);
    // Calcula o total de lucros
    const totalLucros = valoresPagos.reduce((sum, val) => sum + val, 0);
    // Calcula o fluxo financeiro (lucros - despesas)
    const fluxoFinanceiro = totalLucros - totalDespesas;

    // Define as cores consistentes com o tema do site
    const cores = ["#00ff96", "#ff6384", "#ffce56", "#36a2eb", "#cc65fe"];

    // Gráfico de Despesas (barras, valor a receber por cliente)
    {
        // Obtém o contexto do canvas para o gráfico de despesas
        const ctxDespesas = document.getElementById("graficoDespesas").getContext("2d");
        // Cria o gráfico de barras
        new Chart(ctxDespesas, {
            type: "bar",
            data: {
                // Rótulos com os nomes dos clientes
                labels: clientes.length ? clientes : ["Sem dados"],
                datasets: [{
                    // Dados do gráfico (valores aguardando pagamento)
                    label: "Valor a Receber (R$)",
                    data: clientes.length ? valoresAguardando : [0],
                    // Cor da barra
                    backgroundColor: cores[1],
                    // Cor da borda
                    borderColor: cores[1],
                    // Espessura da borda
                    borderWidth: 1,
                }],
            },
            options: {
                // Mantém o gráfico responsivo
                responsive: true,
                // Mantém a proporção do gráfico
                maintainAspectRatio: false,
                // Configurações do título
                plugins: {
                    title: {
                        display: true,
                        text: `Valor a Receber: R$${totalDespesas.toFixed(2)}`,
                        color: "#ffffff",
                        font: { size: 16 },
                    },
                    legend: { display: true, labels: { color: "#ffffff" } },
                },
                // Configurações das escalas
                scales: {
                    y: {
                        beginAtZero: true, // Começa o eixo Y do zero
                        ticks: { color: "#ffffff" }, // Cor dos rótulos do eixo
                    },
                    x: {
                        ticks: { color: "#ffffff" }, // Cor dos rótulos do eixo
                    },
                },
            },
        });
    }

    // Gráfico de Lucros (pizza, lucros por cliente)
    {
        // Obtém o contexto do canvas para o gráfico de lucros
        const ctxLucros = document.getElementById("graficoLucros").getContext("2d");
        // Cria o gráfico de pizza
        new Chart(ctxLucros, {
            type: "pie",
            data: {
                // Rótulos com os nomes dos clientes
                labels: clientes.length ? clientes : ["Sem dados"],
                datasets: [{
                    // Dados do gráfico (valores pagos)
                    label: "Lucros (R$)",
                    data: clientes.length ? valoresPagos : [0],
                    // Cores dos segmentos
                    backgroundColor: cores,
                    // Cor da borda
                    borderColor: "#ffffff",
                    // Espessura da borda
                    borderWidth: 1,
                }],
            },
            options: {
                // Mantém o gráfico responsivo
                responsive: true,
                // Mantém a proporção do gráfico
                maintainAspectRatio: false,
                // Configurações do título
                plugins: {
                    title: {
                        display: true,
                        text: `Total de Lucros: R$${totalLucros.toFixed(2)}`,
                        color: "#ffffff",
                        font: { size: 16 },
                    },
                    legend: { display: true, labels: { color: "#ffffff" } },
                },
            },
        });
    }

    // Gráfico de Fluxo Financeiro (linha, comparação lucros vs despesas)
    {
        // Obtém o contexto do canvas para o gráfico de fluxo
        const ctxFluxo = document.getElementById("graficoFluxo").getContext("2d");
        // Cria o gráfico de linha
        new Chart(ctxFluxo, {
            type: "line",
            data: {
                // Rótulos com os nomes dos clientes
                labels: clientes.length ? clientes : ["Sem dados"],
                datasets: [
                    {
                        // Dados do gráfico (lucros por cliente)
                        label: "Lucros (R$)",
                        data: clientes.length ? valoresPagos : [0],
                        // Cor da linha
                        borderColor: cores[0],
                        // Cor de preenchimento
                        backgroundColor: cores[0],
                        // Preenche a área sob a linha
                        fill: false,
                        // Tamanho dos pontos
                        pointRadius: 5,
                    },
                    {
                        // Dados do gráfico (despesas por cliente)
                        label: "Despesas (R$)",
                        data: clientes.length ? valoresAguardando : [0],
                        // Cor da linha
                        borderColor: cores[1],
                        // Cor de preenchimento
                        backgroundColor: cores[1],
                        // Preenche a área sob a linha
                        fill: false,
                        // Tamanho dos pontos
                        pointRadius: 5,
                    },
                ],
            },
            options: {
                // Mantém o gráfico responsivo
                responsive: true,
                // Mantém a proporção do gráfico
                maintainAspectRatio: false,
                // Configurações do título
                plugins: {
                    title: {
                        display: true,
                        text: `Fluxo Financeiro: R$${fluxoFinanceiro.toFixed(2)}`,
                        color: "#ffffff",
                        font: { size: 16 },
                    },
                    legend: { display: true, labels: { color: "#ffffff" } },
                },
                // Configurações das escalas
                scales: {
                    y: {
                        beginAtZero: true, // Começa o eixo Y do zero
                        ticks: { color: "#ffffff" }, // Cor dos rótulos do eixo
                    },
                    x: {
                        ticks: { color: "#ffffff" }, // Cor dos rótulos do eixo
                    },
                },
            },
        });
    }
}