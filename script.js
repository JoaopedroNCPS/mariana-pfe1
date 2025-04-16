const uri = './assets/dados.json';
let produtos = [];

fetch(uri)
  .then(resp => resp.json())
  .then(resp => { produtos = resp; })
  .then(() => mostrarCards());

function mostrarCards() {
  const main = document.querySelector('main');
  main.innerHTML = '';

  produtos.forEach(p => {
    main.innerHTML += `
      <div class="card">
        <h3>${p.nome}</h3>
        <img src="${p.imagem}" alt="${p.nome}">
        <p>Preço: R$ ${p.preco.toFixed(2)}</p>
        <button onclick="mostrarDetalhes(${p.id})">Detalhes</button>
      </div>
    `;
  });
}

function mostrarDetalhes(id) {
  const produto = produtos.find(p => p.id === id);
  const frete = produto.peso * 0.1;

  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");

  modalContent.innerHTML = `
    <span class="fechar" id="fecharModal">&times;</span>
    <img src="${produto.imagem}" alt="${produto.nome}" class="img-modal">
    <h2>${produto.nome}</h2>
    <p>${produto.descricao}</p>
    <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
    <p><strong>Peso:</strong> ${produto.peso} kg</p>
    <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
  `;

  modal.style.display = "block";

  document.getElementById("fecharModal").onclick = () => {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const index = carrinho.findIndex(p => p.id === id);

  if (index !== -1) {
    carrinho[index].quantidade += 1;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem: produto.imagem,
      quantidade: 1
    });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
  fecharModal();
}
if (document.getElementById("carrinho")) {
    const container = document.getElementById("carrinho");
    const totalDiv = document.getElementById("total");
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  
    function atualizarCarrinho() {
      container.innerHTML = '';
      let total = 0;
  
      if (carrinho.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio.</p>';
        totalDiv.innerText = '';
        return;
      }
  
      carrinho.forEach((item, i) => {
        total += item.preco * item.quantidade;
        container.innerHTML += `
          <div class="card">
            <img src="${item.imagem}" alt="${item.nome}" />
            <h3>${item.nome}</h3>
            <p>Preço: R$ ${item.preco.toFixed(2)}</p>
            <p>Quantidade: 
              <input type="number" min="1" value="${item.quantidade}" onchange="atualizarQuantidade(${i}, this.value)" />
            </p>
            <button onclick="removerDoCarrinho(${i})">Remover</button>
          </div>
        `;
      });
  
      totalDiv.innerText = `Total: R$ ${total.toFixed(2)}`;
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
  
    window.atualizarQuantidade = function(index, quantidade) {
      quantidade = parseInt(quantidade);
      if (quantidade <= 0) {
        carrinho.splice(index, 1);
      } else {
        carrinho[index].quantidade = quantidade;
      }
      atualizarCarrinho();
    };
  
    window.removerDoCarrinho = function(index) {
      carrinho.splice(index, 1);
      atualizarCarrinho();
    };
  
    window.enviarPedido = function() {
      if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }
      localStorage.removeItem("carrinho");
      alert("Pedido enviado com sucesso!");
      window.location.href = "index.html";
    };
  
    atualizarCarrinho();
  }