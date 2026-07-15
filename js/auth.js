import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const provider = new GoogleAuthProvider();
const loginBtn = document.getElementById("loginBtn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        const firstName = user.displayName
        ? user.displayName.split(" ")[0]
        : "User";

        loginBtn.innerHTML = `👋 Hi, ${firstName} ▼`;

        console.log("Already Logged In");

    } else {

        loginBtn.innerHTML = "👤 Log In";

        console.log("Not Logged In");

    }

});

loginBtn.addEventListener("click", () => {

     loginModal.classList.add("show");

});

closeLogin.addEventListener("click", () => {

    loginModal.classList.remove("show");

});

const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {

    if(passwordInput.type==="password"){

        passwordInput.type="text";

        eyeIcon.innerHTML=`
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.77 21.77 0 0 1 5.06-5.94"></path>

        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-2.16 3.19"></path>

        <path d="M1 1L23 23"></path>
        `;

    }else{

        passwordInput.type="password";

        eyeIcon.innerHTML=`
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path>

        <circle cx="12" cy="12" r="3"></circle>
        `;

    }

});
