import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBodc6ohUL5Mjs14zDJ3-8uDfELgZuxnBU",
  authDomain: "trufameli.firebaseapp.com",
  projectId: "trufameli",
  storageBucket: "trufameli.firebasestorage.app",
  messagingSenderId: "320780304917",
  appId: "1:320780304917:web:5c4a313437f6dd73f0441c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// CARRINHO
// ===============================
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarContador() {
    const contador = document.getElementById("contador");
    if (contador) contador.innerText = carrinho.length;
}

window.adicionarProduto = function(nome, preco) {
    carrinho.push({ nome, preco });
    salvarCarrinho();
    atualizarContador();
    alert("Produto adicionado!");
};

window.removerProduto = function(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    mostrarCarrinho();
    atualizarContador();
};

function mostrarCarrinho() {

    const container = document.getElementById("itens-carrinho");
    const totalElemento = document.getElementById("total");
    const botaoFinalizar = document.querySelector(".finalizar");

    if (!container) return;

    container.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;

        container.innerHTML += `
            <div>
                ${item.nome} - R$ ${item.preco.toFixed(2)}
                <button onclick="removerProduto(${index})">X</button>
            </div>
        `;
    });

    totalElemento.innerText = "R$ " + total.toFixed(2);

    botaoFinalizar.onclick = async function() {

        if (carrinho.length === 0) {
            alert("Carrinho vazio!");
            return;
        }

        const nomeCliente = prompt("Digite seu nome:");
        if (!nomeCliente) return;

        try {
            await addDoc(collection(db, "pedidos"), {
                nome: nomeCliente,
                produtos: carrinho,
                total: total,
                criadoEm: serverTimestamp()
            });

            alert("Pedido salvo com sucesso!");

        } catch (e) {
            alert("Erro ao salvar pedido.");
        }

        // WhatsApp
        let mensagem = `Olá, meu nome é ${nomeCliente}.%0A`;
        mensagem += `Pedido:%0A%0A`;

        carrinho.forEach(item => {
            mensagem += `• ${item.nome} - R$ ${item.preco.toFixed(2)}%0A`;
        });

        mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

        const numero = "5512997227154";
        window.open(`https://wa.me/${numero}?text=${mensagem}`);

        carrinho = [];
        salvarCarrinho();
        atualizarContador();
        mostrarCarrinho();
    };
}

atualizarContador();
mostrarCarrinho();
