// Função de Cadastro
function cadastrar() {
    let email = document.getElementById('emailCadastro').value.trim();
    let senha = document.getElementById('senhaCadastro').value.trim();

    if (!email || !senha) {
        alert('Preencha todos os campos!');
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuarios.some(user => user.email === email)) {
        alert('E-mail já cadastrado! Tente outro.');
        return;
    }

    usuarios.push({ email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
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
// Função de Login
function login() {
    let email = document.getElementById('emailLogin').value.trim();
    let senha = document.getElementById('senhaLogin').value.trim();

    if (!email || !senha) {
        alert('Preencha todos os campos!');
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioValido) {
        localStorage.setItem('logado', email);
        window.location.href = email === 'admin@admin.com' ? 'admin.html' : 'registro.html';
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

// Verifica login
function verificarLogin() {
    if (!localStorage.getItem('logado')) {
        alert('Você precisa fazer login!');
        window.location.href = 'index.html';
    }
}

// Verifica se é Admin
function verificarAdmin() {
    if (localStorage.getItem('logado') !== 'admin@admin.com') {
        alert('Acesso restrito!');
        window.location.href = 'index.html';
    } else {
        carregarUsuarios();
    }
}

// Carregar usuários na área de administração
function carregarUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let tabela = document.getElementById('usuariosTabela').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    usuarios.forEach((usuario, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).textContent = usuario.email;
        row.insertCell(1).textContent = '******'; // Esconde a senha

        let actionsCell = row.insertCell(2);
        let editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.onclick = () => editarUsuario(index);

        let excluirButton = document.createElement('button');
        excluirButton.textContent = 'Excluir';
        excluirButton.onclick = () => excluirUsuario(index);

        actionsCell.appendChild(editarButton);
        actionsCell.appendChild(excluirButton);
    });
}

// Editar usuário
function editarUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let usuario = usuarios[index];

    let novoEmail = prompt('Novo e-mail:', usuario.email);
    let novaSenha = prompt('Nova senha:', usuario.senha);

    if (novoEmail && novaSenha) {
        usuarios[index] = { email: novoEmail, senha: novaSenha };
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        carregarUsuarios();
    }
}

// Excluir usuário
function excluirUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    carregarUsuarios();
}

// Logout
function logout() {
    localStorage.removeItem('logado');
    window.location.href = 'index.html';
}

function excluirUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios[index].email === 'admin@admin.com') {
        alert('Você não pode excluir o administrador!');
        return;
    }
    usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    carregarUsuarios();
}

function salvarPedido() {
    let nome = document.getElementById('nome').value.trim();
    let quantidade = document.getElementById('quantidade').value.trim();
    let valor = document.getElementById('valor').value.trim();
    let pagamento = document.getElementById('pagamento').checked ? 'Pago' : 'Aguardando pagamento';

    if (!nome || !quantidade || !valor) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Carregar os pedidos do localStorage
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Gerar ID único para o novo pedido
    let id = pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1;

    // Adicionar novo pedido
    pedidos.push({ id, nome, quantidade, valor, pagamento });

    // Salvar pedidos atualizados no localStorage
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

 
}
    // carregar pedidos
function carregarPedidos() {
    let lista = document.getElementById('listaPedidos');
    lista.innerHTML = '';  // Limpar a lista antes de recarregar

    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Ordenar pedidos por ID (ou status, ou qualquer outro critério)
    pedidos.sort((a, b) => a.id - b.id);  // Ordena por ID crescente

    pedidos.forEach(pedido => {
        let li = document.createElement('li');
        li.className = 'pedido-item';
        li.innerHTML = `
            <span>${pedido.nome} - ${pedido.quantidade}g - R$${pedido.valor} - <strong>${pedido.pagamento}</strong></span>
            <div class="pedido-buttons">
                <button class="btn-pago" onclick="alterarStatus(${pedido.id}, 'Pago')">Pago</button>
                <button class="btn-aberto" onclick="alterarStatus(${pedido.id}, 'Aguardando pagamento')">Em aberto</button>
                <button class="btn-excluir" onclick="excluirPedido(${pedido.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        lista.appendChild(li);
    });
}

    // Exibir cada pedido
    pedidos.forEach(pedido => {
        let li = document.createElement('li');
        li.className = 'pedido-item';
        li.innerHTML = `
            <span>${pedido.nome} - ${pedido.quantidade}g - R$${pedido.valor} - <strong>${pedido.pagamento}</strong></span>
            <div class="pedido-buttons">
                <button class="btn-pago" onclick="alterarStatus(${pedido.id}, 'Pago')">Pago</button>
                <button class="btn-aberto" onclick="alterarStatus(${pedido.id}, 'Aguardando pagamento')">Em aberto</button>
                <button class="btn-excluir" onclick="excluirPedido(${pedido.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        lista.appendChild(li);
    });




// Alterar status do pedido
function alterarStatus(id, status) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos = pedidos.map(p => p.id === id ? { ...p, pagamento: status } : p);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    carregarPedidos();
}

// Excluir Pedido
function excluirPedido(id) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos = pedidos.filter(p => p.id !== id);  // Remove o pedido da lista
    localStorage.setItem('pedidos', JSON.stringify(pedidos));  // Salva a lista atualizada no localStorage
    carregarPedidos();  // Recarrega os pedidos
}


// Função para abrir pedidos em uma nova aba
function abrirPedidos() {
    window.open('pedidos.html', '_blank');
}

// Garante que os pedidos sejam carregados ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('listaPedidos')) carregarPedidos();
    if (document.getElementById('usuariosTabela')) carregarUsuarios();
});
