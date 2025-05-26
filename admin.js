/* Verifica se o usuário é administrador ao carregar a página */
function verificarAdmin() {
    // Verifica se o usuário logado é o administrador
    if (localStorage.getItem("logado") !== "admin@admin.com") {
        alert("Acesso restrito!");
        // Redireciona para a página de login se não for admin
        window.location.href = "index.html";
    } else {
        // Carrega a lista de usuários se for admin
        carregarUsuarios();
    }
}

/* Carrega a lista de usuários na tabela */
function carregarUsuarios() {
    // Carrega os usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Obtém o corpo da tabela de usuários
    let tabela = document.getElementById("usuariosTabela").getElementsByTagName("tbody")[0];
    // Limpa a tabela antes de recarregar
    tabela.innerHTML = "";

    // Itera sobre os usuários para preencher a tabela
    usuarios.forEach((usuario, index) => {
        // Insere uma nova linha na tabela
        let row = tabela.insertRow();
        // Adiciona o e-mail na primeira coluna
        row.insertCell(0).textContent = usuario.email;
        // Esconde a senha na segunda coluna
        row.insertCell(1).textContent = "******";

        // Cria a célula para os botões de ação
        let actionsCell = row.insertCell(2);
        // Cria o botão de editar
        let editarButton = document.createElement("button");
        editarButton.textContent = "Editar";
        editarButton.onclick = () => editarUsuario(index);
        // Cria o botão de excluir
        let excluirButton = document.createElement("button");
        excluirButton.textContent = "Excluir";
        excluirButton.onclick = () => excluirUsuario(index);

        // Adiciona os botões à célula
        actionsCell.appendChild(editarButton);
        actionsCell.appendChild(excluirButton);
    });
}

/* Edita um usuário existente */
function editarUsuario(index) {
    // Carrega os usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Obtém o usuário a ser editado
    let usuario = usuarios[index];

    // Solicita novo e-mail e senha
    let novoEmail = prompt("Novo e-mail:", usuario.email);
    let novaSenha = prompt("Nova senha:", usuario.senha);

    // Verifica se os campos foram preenchidos
    if (novoEmail && novaSenha) {
        // Atualiza os dados do usuário
        usuarios[index] = { email: novoEmail, senha: novaSenha };
        // Salva os usuários atualizados no localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        // Recarrega a tabela
        carregarUsuarios();
    }
}

/* Exclui um usuário */
function excluirUsuario(index) {
    // Carrega os usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Verifica se o usuário é o administrador
    if (usuarios[index].email === "admin@admin.com") {
        alert("Você não pode excluir o administrador!");
        return;
    }
    // Remove o usuário do array
    usuarios.splice(index, 1);
    // Salva os usuários atualizados no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    // Recarrega a tabela
    carregarUsuarios();
}

/* Realiza o logout do usuário */
function logout() {
    // Remove o usuário logado do localStorage
    localStorage.removeItem("logado");
    // Redireciona para a página de login
    window.location.href = "index.html";
}