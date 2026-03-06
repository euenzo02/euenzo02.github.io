import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
getAuth,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const firebaseConfig = {

apiKey: "AIzaSyBodc6ohUL5Mjs14zDJ3-8uDfELgZuxnBU",
authDomain: "trufameli.firebaseapp.com",
projectId: "trufameli"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


const produtosRef = collection(db,"produtos");
const pedidosRef = collection(db,"pedidos");


window.logout = async function(){

await signOut(auth);

window.location.href="admin-login.html";

}


// ====================
// ADICIONAR PRODUTO
// ====================

window.adicionarProduto = async function(){

const nome = document.getElementById("nome").value;
const preco = parseFloat(document.getElementById("preco").value);
const imagem = document.getElementById("imagem").value;

await addDoc(produtosRef,{

nome,
preco,
imagem

});

alert("Produto adicionado");

listarProdutos();

}


// ====================
// LISTAR PRODUTOS
// ====================

async function listarProdutos(){

const lista = document.getElementById("lista-produtos");

lista.innerHTML="";

const querySnapshot = await getDocs(produtosRef);

document.getElementById("total-produtos").innerText=querySnapshot.size;

querySnapshot.forEach((docItem)=>{

const produto = docItem.data();

lista.innerHTML += `

<div>

<span>${produto.nome} - R$ ${produto.preco}</span>

<button class="excluir" onclick="excluirProduto('${docItem.id}')">Excluir</button>

</div>

`;

});

}


// ====================
// EXCLUIR PRODUTO
// ====================

window.excluirProduto = async function(id){

await deleteDoc(doc(db,"produtos",id));

listarProdutos();

}


// ====================
// LISTAR PEDIDOS
// ====================

async function listarPedidos(){

const lista = document.getElementById("lista-pedidos");

lista.innerHTML="";

const querySnapshot = await getDocs(pedidosRef);

let total = 0;

document.getElementById("total-pedidos").innerText=querySnapshot.size;

querySnapshot.forEach((docItem)=>{

const pedido = docItem.data();

total += pedido.total;

lista.innerHTML += `

<div>

<span>

${pedido.nome} - R$ ${pedido.total}

</span>

</div>

`;

});

document.getElementById("total-vendas").innerText="R$ "+total;

}


listarProdutos();
listarPedidos();
