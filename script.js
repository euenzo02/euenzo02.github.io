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
    alert("Produto adicionado ao carrinho!");
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

    if (!container || !totalElemento || !botaoFinalizar) return;

    container.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElemento.innerText = "R$ 0.00";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco;

        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
                <button onclick="removerProduto(${index})" style="background:#c1440e; color:white; border:none; padding:4px 8px; cursor:pointer;">X</button>
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
        if (!nomeCliente) {
            alert("Nome é obrigatório!");
            return;
        }

        try {
            await addDoc(collection(db, "pedidos"), {
                nome: nomeCliente,
                produtos: carrinho,
                total: total,
                criadoEm: serverTimestamp()
            });

            alert("Pedido salvo com sucesso!");

        } catch (e) {
            alert("Erro ao salvar pedido no banco.");
            return;
        }

        let mensagem = `Olá, meu nome é ${nomeCliente}.\n\n`;
        mensagem += `Pedido:\n\n`;

        carrinho.forEach(item => {
            mensagem += `• ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
        });

        mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

        const numero = "5512997227154"; 
        const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        window.location.href = link;

        carrinho = [];
        salvarCarrinho();
        atualizarContador();
        mostrarCarrinho();
    };
}

atualizarContador();
mostrarCarrinho();
