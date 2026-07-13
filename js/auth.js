import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        loginBtn.innerHTML = "👤 " + user.displayName;

        console.log("Already Logged In");

    } else {

        loginBtn.innerHTML = "Log In";

        console.log("Not Logged In");

    }

});

loginBtn.addEventListener("click", async () => {

    if (auth.currentUser) {

        await signOut(auth);

        return;

    }

    try {

        await signInWithPopup(auth, provider);

    } catch (error) {

        console.error(error);

    }

});
