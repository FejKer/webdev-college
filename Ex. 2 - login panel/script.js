const usernameField = document.querySelector('#username');
const passwordField = document.querySelector('#password');
const confirmPasswordField = document.querySelector('#confirm-password');
const emailField = document.querySelector('#email');
const resetButton = document.querySelector('#reset');
const sendButton = document.querySelector('#send');
const form = document.querySelector('form');


/*
function checkPasswordsMatch() {
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;
  
    if (password !== confirmPassword) {
      showError(confirmPasswordField, 'Hasła nie są takie same.');
      return "Hasła nie są takie same!";
    }
    return "";
}

function checkLength(input, min, max, fieldName) {
    if (input.length < min) {
      return `Pole ${fieldName} powinno mieć przynajmniej ${min} znaków.`;
    } else if (input.length > max) {
      return `Pole ${fieldName} powinno mieć maksymalnie ${max} znaków.`;
    } else {
      return "";
    }
}
*/

function checkUsername() {
    const usernameField = document.querySelector('#username');
    const username = usernameField.value;
    const minLength = 3;
    const maxLength = 20;

    if (username.length < minLength || username.length > maxLength) {
      showError(usernameField, `Imię powinno mieć od ${minLength} do ${maxLength} znaków.`);
      return false;
    } else {
      hideError(usernameField);
      return true;
    }
}

function checkPassword() {
    const password = passwordField.value.trim();
    const passwordError = document.querySelector('#password + .error');
    const errorMessages = [];

    if (password === '') {
        errorMessages.push('Hasło jest wymagane.');
    } else {
        if (password.length < 8) {
            errorMessages.push('Hasło musi mieć co najmniej 8 znaków.');
            errorMessages.push("\n");
        }
        if (!/\d/.test(password)) {
            errorMessages.push('Hasło musi zawierać co najmniej jedną cyfrę.');
            errorMessages.push("\n");
        }
        if (!/[A-Z]/.test(password)) {
            errorMessages.push('Hasło musi zawierać co najmniej jedną dużą literę.');
            errorMessages.push("\n");
        }
        if (!/[\W_]/.test(password)) {
            errorMessages.push('Hasło musi zawierać co najmniej jeden znak specjalny.');
            errorMessages.push("\n");
        }
    }
    
    if (errorMessages.length > 0) {
        passwordError.innerHTML = errorMessages.join('<br>');
        passwordError.classList.add('error--active');
        return false;
    } else {
        passwordError.textContent = '';
        passwordError.classList.remove('error--active');
        return true;
    }
}

  

  function checkConfirmPassword() {
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    if (password !== confirmPassword) {
      showError(confirmPasswordField, 'Hasła nie są takie same.');
      return false;
    } else {
      hideError(confirmPasswordField);
      return true;
    }
}

  function checkEmail() {
    const email = emailField.value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      showError(emailField, 'Podaj poprawny adres email.');
      return false;
    } else {
      hideError(emailField);
      return true;
    }
}
  
/*
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(email)) {
        return "";
    } else {
        return "Podano błędny mail.";
    }
}
*/

function showError(field, message) {
    const errorField = field.nextElementSibling;
    errorField.textContent = message;
    errorField.classList.add('error--active');
}

  function hideError(field) {
    const errorField = field.nextElementSibling;
    errorField.textContent = '';
    errorField.classList.remove('error--active');
}


resetButton.addEventListener("click", (e) => {
    console.log("Forumularz wyczyszczony");
    clearErrorMessages();
}
)

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error');
    errorMessages.forEach((errorMessage) => {
      errorMessage.textContent = '';
      errorMessage.classList.remove('error--active');
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }   
});

sendButton.addEventListener("click", (e) => {
    /*const username = usernameField.value;
    const password = passwordField.value;
    const email = emailField.value;

    const passwordMatchError = checkPasswordsMatch();
    const usernameError = checkLength(username, 3, 20, "Imię");
    const passwordError = checkLength(password, 8, 20, "Hasło");
    const emailError = isValidEmail(email);

    if (usernameError || passwordError || passwordMatchError || emailError) {
        alert(`${usernameError}\n${passwordError}\n${passwordMatchError}\n${emailError}`);
        e.preventDefault();
        return;
    }
*/

    e.preventDefault();
    const isValidUsername = checkUsername();
    const isValidPassword = checkPassword();
    const isValidConfirmPassword = checkConfirmPassword();
    const isValidEmail = checkEmail();

    if (isValidUsername && isValidPassword && isValidConfirmPassword && isValidEmail) {
        console.log('Wysłano formularz.');
    }

}
)