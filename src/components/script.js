const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const spinner = document.getElementById('spinner');
const btnText = document.getElementById('btnText');
const errorAlert = document.getElementById('errorAlert');
const successAlert = document.getElementById('successAlert');

togglePassword.addEventListener('click', function(e) {
    e.preventDefault();
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁' : '👁‍🗨';
});

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(message) {
    errorAlert.textContent = message;
    errorAlert.classList.add('show');
    successAlert.classList.remove('show');
}

function showSuccess() {
    successAlert.classList.add('show');
    errorAlert.classList.remove('show');
}

function hideAlerts() {
    setTimeout(function() {
        errorAlert.classList.remove('show');
        successAlert.classList.remove('show');
    }, 3000);
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    errorAlert.classList.remove('show');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    loginBtn.disabled = true;
    spinner.classList.add('show');
    btnText.textContent = 'Logging in...';

    setTimeout(function() {
        loginBtn.disabled = false;
        spinner.classList.remove('show');
        btnText.textContent = 'Sign In';
        
        showSuccess();
        loginForm.reset();
        hideAlerts();
    }, 1500);
});

emailInput.addEventListener('focus', function() {
    errorAlert.classList.remove('show');
});

passwordInput.addEventListener('focus', function() {
    errorAlert.classList.remove('show');
});
