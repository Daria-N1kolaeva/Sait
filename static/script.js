const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const registerBtn1 = document.getElementById('register1');

registerBtn1.addEventListener('click', () => {
    const successMessage = registerBtn1.getAttribute('data-success-message');
    if (successMessage) {
        showSuccessMessage(successMessage);
    }
});

function showSuccessMessage(message) {
    alert(message);
}


registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

