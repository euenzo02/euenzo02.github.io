import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
query,
orderBy
}
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


async function carregarPedidos(){

const container = document.getElementById("lista-pedidos");

container.innerHTML = "Carregando pedidos...";


const q = query(collection(db,"pedidos"), orderBy("criadoEm","desc"));

const querySnapshot = await getDocs(q);


container.innerHTML = "";


querySnapshot.forEach((doc)=>{

const pedido = doc.data();

let produtosHTML = "";

pedido.produtos.forEach(produto=>{

produtosHTML += `<li>${produto.nome} - R$ ${produto.preco}</li>`;

});


container.innerHTML += `

<div style="background:white;padding:20px;margin-bottom:20px;border-radius:10px">

<h3>Cliente: ${pedido.nome}</h3>

<ul>
${produtosHTML}
</ul>

<strong>Total: R$ ${pedido.total}</strong>

</div>

`;

});

}


carregarPedidos();
