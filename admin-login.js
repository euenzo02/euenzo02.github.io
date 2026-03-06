import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { 
getAuth,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {

apiKey: "SUA_API_KEY",
authDomain: "SEU_AUTH_DOMAIN",
projectId: "SEU_PROJECT_ID"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


window.login = async function(){

const email = document.getElementById("email").value;
const senha = document.getElementById("senha").value;

try{

await signInWithEmailAndPassword(auth,email,senha);

window.location.href = "admin.html";

}

catch{

document.getElementById("erro").innerText="Login inválido";

}

}
