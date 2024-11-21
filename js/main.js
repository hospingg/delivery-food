const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const buttonLogout = document.querySelector('.button-out');
const loginInput = document.querySelector('#login');
const passInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const logInForm = document.querySelector('#logInForm');
const closeModalButton = document.querySelector('.close-auth');
const mes = document.querySelector('#ps')


function toggleModal() {
   modalAuth.classList.toggle('is-open');
   document.body.classList.toggle('remove-scroll')

   loginInput.classList.remove('required');
   passInput.classList.remove('required');
   mes.classList.add('hide')
}

buttonAuth.addEventListener('click', toggleModal);

closeModalButton.addEventListener('click', toggleModal);

modalAuth.addEventListener('click', (event) => {
   if (!event.target.closest('.auth-form')) {
      toggleModal();
   }
});
function logIn(event) {
   event.preventDefault();

   const login = loginInput.value.trim();
   if (login === "") {
      loginInput.classList.add('required');
      passInput.classList.add('required');
      mes.classList.remove('hide')
      return;
   }

   localStorage.setItem('nameParametr', login);

   userName.textContent = login;
   userName.style.display = 'inline';

   buttonAuth.style.display = 'none';
   buttonLogout.style.display = 'inline-block';

   toggleModal();
   logInForm.reset();
   loginInput.style.border = '';
}

logInForm.addEventListener('submit', logIn);

document.addEventListener('DOMContentLoaded', function() {
   const savedLogin = localStorage.getItem('nameParametr');

   if (savedLogin) {
      userName.textContent = savedLogin;
      userName.style.display = 'inline';
      buttonAuth.style.display = 'none';
      buttonLogout.style.display = 'inline-block';
   } else {
      buttonAuth.style.display = 'block';
      buttonLogout.style.display = 'none';
   }
});

function logout() {
   localStorage.removeItem('nameParametr');
   userName.textContent = '';
   userName.style.display = 'none';

   buttonAuth.style.display = 'block';
   buttonLogout.style.display = 'none';
}

buttonLogout.addEventListener('click', logout);