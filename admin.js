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
import { useFireproof } from "use-fireproof"
import { useState } from "react"

export default function App() {
  const { database, useDocument, useLiveQuery } = useFireproof("user-access-db")
  const { doc, merge, submit } = useDocument({ name: "", access: "read", action: "" })
  const { docs } = useLiveQuery("name", {})
  const [filter, setFilter] = useState("")

  const demo = () => {
    const demoData = [
      { name: "Alice", access: "admin", action: "Created project" },
      { name: "Bob", access: "read", action: "Viewed report" },
      { name: "Carol", access: "write", action: "Updated record" },
    ]
    demoData.forEach((d) => database.put({ ...d, createdAt: Date.now() }))
  }

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="max-w-xl mx-auto p-4 bg-gradient-to-br from-orange-700 to-pink-600 text-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-2">🔐 User Access & Activity Tracker</h1>
      <p className="italic text-sm mb-4">*Track user access levels and log actions in real time. Add users, set permissions, and log actions. Use the filter to search by name.*</p>

      <input
        value={doc.name}
        onChange={(e) => merge({ name: e.target.value })}
        placeholder="User name"
        className="mb-2 p-2 rounded w-full text-black"
      />
      <select
        value={doc.access}
        onChange={(e) => merge({ access: e.target.value })}
        className="mb-2 p-2 rounded w-full text-black"
      >
        <option value="read">Read</option>
        <option value="write">Write</option>
        <option value="admin">Admin</option>
      </select>
      <input
        value={doc.action}
        onChange={(e) => merge({ action: e.target.value })}
        placeholder="Action performed"
        className="mb-2 p-2 rounded w-full text-black"
      />
      <button onClick={submit} className="mb-4 bg-orange-500 hover:bg-orange-600 p-2 rounded w-full font-bold">
        Log Action
      </button>
      <button onClick={demo} className="mb-4 bg-yellow-400 hover:bg-yellow-500 p-2 rounded w-full font-bold">
        Demo data
      </button>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search by name"
        className="mb-4 p-2 rounded w-full text-black"
      />

      <ul>
        {filtered.map((d) => (
          <li key={d._id} className="mb-3 p-3 bg-white bg-opacity-10 rounded shadow">
            <div className="text-lg font-semibold">{d.name} - <span className="italic">{d.access}</span></div>
            <div className="text-sm">{d.action}</div>
            <div className="text-xs text-gray-300">{new Date(d.createdAt || d._id.substring(0, 8) * 1000).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
/* Realiza o logout do usuário */
function logout() {
    // Remove o usuário logado do localStorage
    localStorage.removeItem("logado");
    // Redireciona para a página de login
    window.location.href = "index.html";
}
