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


// =============================
// CARRINHO
// =============================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


// =============================
// CONTADOR DO CARRINHO
// =============================

function atualizarContador() {

    const contador = document.getElementById("contador");

    if (contador) {
        contador.innerText = carrinho.length;
    }

}


// =============================
// ADICIONAR PRODUTO
// =============================

window.adicionarProduto = function(nome, preco) {

    carrinho.push({ nome, preco });

    salvarCarrinho();

    atualizarContador();

    alert("Produto adicionado ao carrinho!");

};


// =============================
// REMOVER PRODUTO POR INDEX
// =============================

window.removerProduto = function(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarContador();

    mostrarCarrinho();

};


// =============================
// REMOVER POR NOME (remove 1 unidade)
// =============================

window.removerProdutoNome = function(nome) {

    const index = carrinho.findIndex(p => p.nome === nome);

    if (index !== -1) {

        carrinho.splice(index,1);

    }

    salvarCarrinho();

    atualizarContador();

    mostrarCarrinho();

};


// =============================
// MOSTRAR CARRINHO
// =============================

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

    // =============================
    // AGRUPAR PRODUTOS
    // =============================

    const produtosAgrupados = {};

    carrinho.forEach(item => {

        if (!produtosAgrupados[item.nome]) {

            produtosAgrupados[item.nome] = {
                preco: item.preco,
                quantidade: 0
            };

        }

        produtosAgrupados[item.nome].quantidade++;

    });


    // =============================
    // MOSTRAR PRODUTOS AGRUPADOS
    // =============================

    for (let nome in produtosAgrupados) {

        const produto = produtosAgrupados[nome];

        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        container.innerHTML += `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">

                <span>
                ${nome} x${produto.quantidade} - R$ ${subtotal.toFixed(2)}
                </span>

                <button onclick="removerProdutoNome('${nome}')"
                style="background:#c1440e;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">
                -
                </button>

            </div>
        `;

    }

    totalElemento.innerText = "R$ " + total.toFixed(2);


    // =============================
    // FINALIZAR PEDIDO
    // =============================

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

        if (!confirm("Deseja finalizar o pedido?")) {

            return;

        }

        // SALVAR NO FIREBASE

        try {

            await addDoc(collection(db, "pedidos"), {

                nome: nomeCliente,
                produtos: carrinho,
                total: total,
                criadoEm: serverTimestamp()

            });

            alert("Pedido registrado com sucesso!");

        }

        catch (erro) {

            alert("Erro ao salvar pedido no banco.");

            console.error(erro);

            return;

        }


        // =============================
        // AGRUPAR PRODUTOS PARA WHATSAPP
        // =============================

        const agrupadoWhats = {};

        carrinho.forEach(item => {

            if (!agrupadoWhats[item.nome]) {

                agrupadoWhats[item.nome] = {
                    preco: item.preco,
                    quantidade: 0
                };

            }

            agrupadoWhats[item.nome].quantidade++;

        });


        // =============================
        // MENSAGEM WHATSAPP
        // =============================

        let mensagem = `🍫 *Pedido Trufameli*\n\n`;

        mensagem += `👤 Cliente: ${nomeCliente}\n\n`;

        mensagem += `🛒 Pedido:\n`;

        for (let nome in agrupadoWhats) {

            const produto = agrupadoWhats[nome];

            const subtotal = produto.preco * produto.quantidade;

            mensagem += `• ${nome} x${produto.quantidade} - R$ ${subtotal.toFixed(2)}\n`;

        }

        mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;

        const numero = "5512997227154";

        const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        window.location.href = link;


        // LIMPAR CARRINHO

        carrinho = [];

        salvarCarrinho();

        atualizarContador();

        mostrarCarrinho();

    };

}


// =============================
// INICIALIZAÇÃO
// =============================

atualizarContador();

mostrarCarrinho();
