import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

document.getElementById("loginBtn").addEventListener("click", async () => {

    try {

        const result = await signInWithPopup(auth, provider);

        console.log(result.user);

        alert("Welcome " + result.user.displayName);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});
