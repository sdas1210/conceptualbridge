import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ==========================================
// 1. REUSABLE TOAST NOTIFICATION COMPONENT
// ==========================================
export function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const icons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️"
    };

    const toast = document.createElement("div");
    toast.className = `cb-toast ${type}`;
    toast.innerHTML = `
        <span class="cb-toast-icon">${icons[type] || "ℹ️"}</span>
        <span class="cb-toast-message">${message}</span>
        <button class="cb-toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    const removeToast = () => {
        toast.classList.remove("show");
        toast.addEventListener("transitionend", () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    };

    toast.querySelector(".cb-toast-close").addEventListener("click", removeToast);
    setTimeout(removeToast, 4000);
}

// Friendly Firebase Error Code Translator
function getFirebaseErrorMessage(code) {
    switch (code) {
        case "auth/email-already-in-use":
            return "An account with this email address already exists.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/weak-password":
            return "Password should be at least 6 characters long.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password. Please try again.";
        case "auth/too-many-requests":
            return "Too many failed attempts. Please try again later.";
        case "auth/popup-closed-by-user":
            return "Google Sign-In was closed before completing.";
        case "auth/network-request-failed":
            return "Network connection error. Please check your internet connection.";
        default:
            return "An unexpected authentication error occurred. Please try again.";
    }
}

// ==========================================
// 2. DOM ELEMENTS CACHE
// ==========================================
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginBtn = document.getElementById("loginBtn");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");

// Form Panels
const loginFormPanel = document.getElementById("loginFormPanel");
const signupFormPanel = document.getElementById("signupFormPanel");
const resetPasswordPanel = document.getElementById("resetPasswordPanel");
const verificationPanel = document.getElementById("verificationPanel");

// Links
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const showSignupLink = document.getElementById("showSignupLink");
const backToLogin = document.getElementById("backToLogin");
const backToLoginFromSignup = document.getElementById("backToLoginFromSignup");

// Inputs & Actions
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const emailLoginBtn = document.getElementById("emailLoginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");

const signupNameInput = document.getElementById("signupNameInput");
const signupEmailInput = document.getElementById("signupEmailInput");
const signupPasswordInput = document.getElementById("signupPasswordInput");
const signupConfirmPasswordInput = document.getElementById("signupConfirmPasswordInput");
const signupBtn = document.getElementById("signupBtn");

const resetEmailInput = document.getElementById("resetEmailInput");
const sendResetBtn = document.getElementById("sendResetBtn");

const verificationEmailDisplay = document.getElementById("verificationEmailDisplay");
const resendVerificationBtn = document.getElementById("resendVerificationBtn");
const continueToLoginBtn = document.getElementById("continueToLoginBtn");

const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

const provider = new GoogleAuthProvider();

// ==========================================
// 3. REUSABLE AUTHENTICATION HELPERS
// ==========================================

export function resetAuthenticationForms() {
    emailInput.value = "";
    passwordInput.value = "";
    signupNameInput.value = "";
    signupEmailInput.value = "";
    signupPasswordInput.value = "";
    signupConfirmPasswordInput.value = "";
    resetEmailInput.value = "";
}

export function switchPanel(targetPanel) {
    loginFormPanel.style.display = "none";
    signupFormPanel.style.display = "none";
    resetPasswordPanel.style.display = "none";
    verificationPanel.style.display = "none";

    targetPanel.style.display = "block";

    // Polish 4: Automatic Input/Element Focus
    setTimeout(() => {
        const firstInput = targetPanel.querySelector("input:not([type='hidden'])");
        if (firstInput) {
            firstInput.focus();
        } else {
            const firstButton = targetPanel.querySelector("button.login-action");
            if (firstButton) firstButton.focus();
        }
    }, 50);
}

export function openLoginModal() {
    resetAuthenticationForms();
    switchPanel(loginFormPanel);
    loginModal.classList.add("show");
}

export function closeLoginModal() {
    loginModal.classList.remove("show");
    resetAuthenticationForms();
    switchPanel(loginFormPanel);
}

/**
 * Polish 3: Accessibility Improvements (aria-busy="true") & Loading Protection
 */
async function withLoading(buttonElement, asyncFn, loadingText = "Please wait...") {
    if (!buttonElement || buttonElement.disabled) return;

    const originalHTML = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.setAttribute("aria-busy", "true");
    buttonElement.style.opacity = "0.75";
    buttonElement.style.cursor = "not-allowed";
    buttonElement.innerHTML = `<span class="spinner-loader"></span> ${loadingText}`;

    try {
        await asyncFn();
    } finally {
        buttonElement.disabled = false;
        buttonElement.removeAttribute("aria-busy");
        buttonElement.style.opacity = "";
        buttonElement.style.cursor = "";
        buttonElement.innerHTML = originalHTML;
    }
}

/**
 * Polish 2: Enter Key Keyboard Submission Handler
 */
function setupEnterKeySubmission(panelElement, submitButton) {
    if (!panelElement || !submitButton) return;
    const inputs = panelElement.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                submitButton.click();
            }
        });
    });
}

// Bind Enter key submissions to visible active panels
setupEnterKeySubmission(loginFormPanel, emailLoginBtn);
setupEnterKeySubmission(signupFormPanel, signupBtn);
setupEnterKeySubmission(resetPasswordPanel, sendResetBtn);

// ==========================================
// 4. AUTH STATE OBSERVER (SINGLE UI AUTHORITY)
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        const firstName = user.displayName ? user.displayName.split(" ")[0] : "User";

        loginBtn.innerHTML = `
            <span class="wave-hand wave">
                <img src="/Resources/Icons/hand-wave.svg" class="wave-svg" alt="">
            </span>
            Hi, ${firstName} ▼
        `;

        const hand = loginBtn.querySelector(".wave-hand");
        if (hand) {
            hand.addEventListener("animationend", () => {
                hand.classList.remove("wave");
            });
        }
    } else {
        loginBtn.innerHTML = `
            <img src="/Resources/Icons/user.svg" class="nav-icon" alt="">
            Log In
        `;
        if (profileDropdown) {
            profileDropdown.classList.remove("show");
        }
    }
});

// ==========================================
// 5. EVENT LISTENERS & AUTH ACTIONS
// ==========================================

// Open Modal or Toggle Class-Based Profile Dropdown
loginBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (auth.currentUser) {
        profileDropdown.classList.toggle("show");
        return;
    }
    openLoginModal();
});

// Close Dropdown on outside click
document.addEventListener("click", (event) => {
    if (profileDropdown && !profileDropdown.contains(event.target) && !loginBtn.contains(event.target)) {
        profileDropdown.classList.remove("show");
    }
});

// Close Modal Triggers
closeLogin.addEventListener("click", closeLoginModal);

loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
        closeLoginModal();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
        closeLoginModal();
    }
});

// Panel Navigation Triggers
forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchPanel(resetPasswordPanel);
});

showSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchPanel(signupFormPanel);
});

backToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchPanel(loginFormPanel);
});

backToLoginFromSignup.addEventListener("click", (e) => {
    e.preventDefault();
    switchPanel(loginFormPanel);
});

continueToLoginBtn.addEventListener("click", () => {
    switchPanel(loginFormPanel);
});

// Password Mask Toggle
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a21.77 21.77 0 0 1 5.06-5.94"></path>
            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-2.16 3.19"></path>
            <path d="M1 1L23 23"></path>
        `;
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = `
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
});

// 1. Google Login
googleLoginBtn.addEventListener("click", async () => {
    await withLoading(googleLoginBtn, async () => {
        try {
            await signInWithPopup(auth, provider);
            closeLoginModal();
            showToast("Signed in successfully with Google!", "success");
        } catch (error) {
            if (error.code !== "auth/popup-closed-by-user") {
                showToast(getFirebaseErrorMessage(error.code), "error");
            }
        }
    }, "Signing in...");
});

// 2. Email Login (with Unverified Email Prevention)
emailLoginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showToast("Please enter both email address and password.", "warning");
        return;
    }

    await withLoading(emailLoginBtn, async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Strict Unverified Email Check
            if (!user.emailVerified) {
                verificationEmailDisplay.innerText = user.email;
                await signOut(auth);
                switchPanel(verificationPanel);
                showToast("Your email address is not verified yet. Check your inbox or resend verification.", "warning");
                return;
            }

            closeLoginModal();
            showToast("Welcome back! Logged in successfully.", "success");
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code), "error");
        }
    }, "Logging in...");
});

// 3. Create Account (with Auto Sign-Out Flow)
signupBtn.addEventListener("click", async () => {
    const fullName = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;

    if (!fullName || !email || !password || !confirmPassword) {
        showToast("Please fill in all registration fields.", "warning");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters long.", "warning");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match. Please verify.", "warning");
        return;
    }

    await withLoading(signupBtn, async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: fullName });
            await sendEmailVerification(userCredential.user);

            // Immediate sign out after registration to prevent unverified active sessions
            await signOut(auth);

            verificationEmailDisplay.innerText = email;
            switchPanel(verificationPanel);
            showToast("Account created! Please check your email to verify before logging in.", "success");

            resetAuthenticationForms();
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code), "error");
        }
    }, "Creating Account...");
});

// 4. Polish 1: Improved Resend Verification Email UX
resendVerificationBtn.addEventListener("click", async () => {
    const targetEmail = verificationEmailDisplay.innerText;
    const password = passwordInput.value;

    // Direct dispatch if user session is active
    if (auth.currentUser) {
        await withLoading(resendVerificationBtn, async () => {
            try {
                await sendEmailVerification(auth.currentUser);
                showToast("Verification link sent! Check your email inbox.", "success");
            } catch (error) {
                showToast(getFirebaseErrorMessage(error.code), "error");
            }
        }, "Sending Link...");
        return;
    }

    // Unauthenticated user resend flow logic
    if (!targetEmail || targetEmail === "your email") {
        showToast("Please enter your email on the Login form.", "warning");
        switchPanel(loginFormPanel);
        return;
    }

    if (password) {
        await withLoading(resendVerificationBtn, async () => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
                await sendEmailVerification(userCredential.user);
                await signOut(auth);
                showToast("Verification link sent! Check your email inbox.", "success");
            } catch (error) {
                showToast("Unable to resend: " + getFirebaseErrorMessage(error.code), "error");
            }
        }, "Sending Link...");
    } else {
        // Smooth guidance transition to password input on Login panel
        emailInput.value = targetEmail !== "your email" ? targetEmail : "";
        switchPanel(loginFormPanel);
        showToast("Please enter your password to resend the verification link.", "info");
    }
});

// 5. Password Reset
sendResetBtn.addEventListener("click", async () => {
    const email = resetEmailInput.value.trim();

    if (!email) {
        showToast("Please enter your registered email address.", "warning");
        return;
    }

    await withLoading(sendResetBtn, async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            showToast("Password reset link sent! Check your email inbox.", "success");
            resetEmailInput.value = "";
            switchPanel(loginFormPanel);
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code), "error");
        }
    }, "Sending Reset Link...");
});

// 6. Polish 5: Complete UI Logout Cleanup Sequence
logoutBtn.addEventListener("click", async () => {
    await withLoading(logoutBtn, async () => {
        try {
            // Step 1: Close Profile Dropdown
            if (profileDropdown) {
                profileDropdown.classList.remove("show");
            }

            // Step 2: Close Authentication Modal (if open)
            loginModal.classList.remove("show");

            // Step 3: Reset All Authentication Forms
            resetAuthenticationForms();

            // Step 4: Return Authentication Panels to Default Login State
            switchPanel(loginFormPanel);

            // Step 5: Perform Firebase SignOut
            await signOut(auth);

            // Step 6: Display Success Toast
            showToast("Logged out successfully.", "info");

            // Step 7: onAuthStateChanged() automatically updates header navigation UI
        } catch (error) {
            showToast("Error logging out. Please try again.", "error");
        }
    }, "Logging out...");
});
