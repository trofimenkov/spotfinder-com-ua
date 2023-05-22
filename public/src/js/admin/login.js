function togglePassword() {
    var passwordInput = document.getElementById("password");
    var toggleButton = document.querySelector(".toggle-password i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.classList.remove("fa-eye");
        toggleButton.classList.add("fa-eye-slash");
        passwordInput.classList.add("active");
    } else {
        passwordInput.type = "password";
        toggleButton.classList.remove("fa-eye-slash");
        toggleButton.classList.add("fa-eye");
        passwordInput.classList.remove("active");
    }
}
