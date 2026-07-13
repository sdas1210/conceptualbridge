import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    loginBtn.disabled = true;

    try {

        const result = await signInWithPopup(auth, provider);

        console.log("Logged in:", result.user);

    } catch (error) {

        console.error(error.code, error.message);

    } finally {

        loginBtn.disabled = false;

    }

});
