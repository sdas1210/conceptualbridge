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

loginBtn.addEventListener("click", async () => {

     loginModal.style.display = "flex";

});

closeLogin.addEventListener("click", () => {

    loginModal.style.display = "none";

});

const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});
