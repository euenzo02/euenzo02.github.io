import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {

apiKey: "AIzaSyBodc6ohUL5Mjs14zDJ3-8uDfELgZuxnBU",

authDomain: "trufameli.firebaseapp.com",

projectId: "trufameli",

storageBucket: "trufameli.firebasestorage.app",

messagingSenderId: "320780304917",

appId: "1:320780304917:web:5c4a313437f6dd73f0441c"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

window.login = function(){

const email = document.getElementById("email").value;
const senha = document.getElementById("senha").value;

signInWithEmailAndPassword(auth,email,senha)

.then(()=>{

window.location.href="admin.html";

})

.catch(()=>{

document.getElementById("erro").innerText="Login inválido";

});

}
