// ===============================
// CONFIG FIREBASE
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBodc6ohUL5Mjs14zDJ3-8uDfELgZuxnBU",
  authDomain: "trufameli.firebaseapp.com",
  projectId: "trufameli",
  storageBucket: "trufameli.firebasestorage.app",
  messagingSenderId: "320780304917",
  appId: "1:320780304917:web:5c4a313437f6dd73f0441c"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// serviços
const auth = firebase.auth();
const db = firebase.firestore();


// ===============================
// LOGIN ADMIN
// ===============================

function loginAdmin() {

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  auth.signInWithEmailAndPassword(email, senha)
  .then(() => {

    document.getElementById("login").style.display = "none";
    document.getElementById("painel").style.display = "block";

    carregarProdutos();

  })
  .catch((error) => {

    alert("Erro no login: " + error.message);

  });

}


// ===============================
// LOGOUT
// ===============================

function logoutAdmin(){

  auth.signOut().then(()=>{

    document.getElementById("login").style.display = "block";
    document.getElementById("painel").style.display = "none";

  });

}


// ===============================
// VERIFICAR LOGIN
// ===============================

auth.onAuthStateChanged((user)=>{

  if(user){

    document.getElementById("login").style.display = "none";
    document.getElementById("painel").style.display = "block";

    carregarProdutos();

  }

});


// ===============================
// ADICIONAR PRODUTO
// ===============================

function adicionarProduto(){

  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const imagem = document.getElementById("imagem").value;

  db.collection("produtos").add({

    nome: nome,
    preco: preco,
    imagem: imagem

  })
  .then(()=>{

    alert("Produto adicionado!");
    carregarProdutos();

  });

}


// ===============================
// CARREGAR PRODUTOS
// ===============================

function carregarProdutos(){

  const lista = document.getElementById("listaProdutos");

  lista.innerHTML = "";

  db.collection("produtos").get().then((snapshot)=>{

    snapshot.forEach((doc)=>{

      const produto = doc.data();

      lista.innerHTML += `

      <div class="produtoAdmin">

        <img src="${produto.imagem}" width="80">

        <h3>${produto.nome}</h3>

        <p>R$ ${produto.preco}</p>

        <button onclick="deletarProduto('${doc.id}')">
        Excluir
        </button>

      </div>

      `;

    });

  });

}


// ===============================
// DELETAR PRODUTO
// ===============================

function deletarProduto(id){

  db.collection("produtos").doc(id).delete()
  .then(()=>{

    carregarProdutos();

  });

}
