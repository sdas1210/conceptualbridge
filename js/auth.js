import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const provider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("googleLoginBtn");
const loginBtn = document.getElementById("loginBtn");
const loginFormPanel = document.getElementById("loginFormPanel");
const resetPasswordPanel = document.getElementById("resetPasswordPanel");

const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const backToLogin = document.getElementById("backToLogin");
const emailInput =
document.getElementById("emailInput");

const passwordInput =
document.getElementById("passwordInput");

const emailLoginBtn =
document.getElementById("emailLoginBtn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        const firstName = user.displayName
        ? user.displayName.split(" ")[0]
        : "User";

        loginBtn.innerHTML = `
        <span class="wave-hand wave">
            <img src="/Resources/Icons/hand-wave.svg"
                 class="wave-svg"
                 alt="">
        </span>
        Hi, ${firstName} ▼
        `;
        
        const hand = loginBtn.querySelector(".wave-hand");
        
        hand.addEventListener("animationend", () => {
        
            hand.classList.remove("wave");
        
        });

        console.log("Already Logged In");

    } else {

        loginBtn.innerHTML = `
        <img src="/Resources/Icons/user.svg" class="nav-icon" alt="">
        Log In
        `;

        console.log("Not Logged In");

    }

});

loginBtn.addEventListener("click", () => {

     // Always start from the Login screen
    loginFormPanel.style.display = "block";
    resetPasswordPanel.style.display = "none";

    loginModal.classList.add("show");

});

closeLogin.addEventListener("click", () => {

    loginModal.classList.remove("show");

    loginFormPanel.style.display = "block";
    resetPasswordPanel.style.display = "none";

});

loginModal.addEventListener("click", (event) => {

    if (event.target === loginModal) {

        loginModal.classList.remove("show");

        loginFormPanel.style.display = "block";
        resetPasswordPanel.style.display = "none";

    }

});


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

window.addEventListener("keydown", (event) => {

    console.log("Key Pressed:", event.key);

    if (
        event.key === "Escape" ||
        event.key === "Esc"
    ) {

        event.preventDefault();

        loginModal.classList.remove("show");

    }

});
forgotPasswordLink.addEventListener("click", (e) => {

    e.preventDefault();

    loginFormPanel.style.display = "none";

    resetPasswordPanel.style.display = "block";

});
backToLogin.addEventListener("click", (e) => {

    e.preventDefault();

    resetPasswordPanel.style.display = "none";

    loginFormPanel.style.display = "block";

});
googleLoginBtn.addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, provider);

        loginModal.classList.remove("show");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});
emailLoginBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

        alert("Please enter your email and password.");

        return;

    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginModal.classList.remove("show");

    }

    catch(error){

        alert(error.message);

        console.error(error);

    }

});


