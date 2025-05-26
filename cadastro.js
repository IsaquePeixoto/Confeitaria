/* Cadastra um novo usuário */
function cadastrar() {
    // Obtém o e-mail inserido pelo usuário
    let email = document.getElementById("emailCadastro").value.trim();
    // Obtém a senha inserida pelo usuário
    let senha = document.getElementById("senhaCadastro").value.trim();

    // Verifica se os campos estão preenchidos
    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    // Carrega os usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o e-mail já está cadastrado
    if (usuarios.some((user) => user.email === email)) {
        alert("E-mail já cadastrado! Tente outro.");
        return;
    }

    // Adiciona o novo usuário ao array de usuários
    usuarios.push({ email, senha });
    // Salva o array atualizado no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Exibe mensagem de sucesso
    alert("Cadastro realizado com sucesso!");
    // Redireciona para a página de login
    window.location.href = "index.html";
}