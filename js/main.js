const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const buttonLogout = document.querySelector('.button-out');
const loginInput = document.querySelector('#login');
const passInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const logInForm = document.querySelector('#logInForm');
const closeModalButton = document.querySelector('.close-auth');
const restaurantSearch = document.querySelector('.input-search.input');
const mes = document.querySelector('#ps');
const restaurantList = document.querySelector('.cards-restaurants');

function createCard({ name, image, deliveryTime, rating, price, category, products }) {
   const card = document.createElement('a');
   card.href = `restaurant.html?products=${products}&restaurant=${name}&price=${price}&rating=${rating}&category=${category}`;
   card.classList.add('card', 'card-restaurant');

   const img = document.createElement('img');
   img.src = image;
   img.alt = 'image';
   img.classList.add('card-image');
   card.appendChild(img);

   const cardText = document.createElement('div');
   cardText.classList.add('card-text');

   const cardHeading = document.createElement('div');
   cardHeading.classList.add('card-heading');
   const title = document.createElement('h3');
   title.classList.add('card-title');
   title.textContent = name;
   const tag = document.createElement('span');
   tag.classList.add('card-tag', 'tag');
   tag.textContent = deliveryTime + ' хвилин';
   cardHeading.appendChild(title);
   cardHeading.appendChild(tag);
   cardText.appendChild(cardHeading);

   const cardInfo = document.createElement('div');
   cardInfo.classList.add('card-info');

   const ratingDiv = document.createElement('div');
   ratingDiv.classList.add('rating');
   ratingDiv.textContent = rating;

   const priceDiv = document.createElement('div');
   priceDiv.classList.add('price');
   priceDiv.textContent = 'від ' + price + ' ₴';

   const categoryDiv = document.createElement('div');
   categoryDiv.classList.add('category');
   categoryDiv.textContent = category;

   cardInfo.appendChild(ratingDiv);
   cardInfo.appendChild(priceDiv);
   cardInfo.appendChild(categoryDiv);
   cardText.appendChild(cardInfo);

   card.appendChild(cardText);
   restaurantList.appendChild(card);
}

function renderCards(data) {
   restaurantList.innerHTML = '';
   data.forEach(createCard);
}

function searchRestaurants(event) {
    //Отримуємо значення з поля пошуку
   const searchValue = event.target.value.toLowerCase().trim();
   // Якщо користувач написав не одне слово, розбиваємо їх через пробіл
   const searchWords = searchValue.split(/\s+/);

   //Запит на отримання карток
   fetch('./js/cards.json')
      .then((response) => response.json())
      // Фільруємо отриману інформацію про ресторани для пошуку
      .then((data) => {
         const filteredData = data.filter(({ name, category }) => {
            const lowerCaseName = name.toLowerCase();
            const lowerCaseCategory = category.toLowerCase();

            return searchWords.some((word) =>
               lowerCaseName.includes(word) || lowerCaseCategory.includes(word)
            );
         });
         // Рендеримо картки на основі запиту користувача
         renderCards(filteredData);
      })
      .catch((err) => {
         console.error('Error loading cards:', err);
      });
}

restaurantSearch.addEventListener('input', searchRestaurants);

fetch('./js/cards.json')
   .then((response) => response.json())
   .then((data) => {
      renderCards(data);
   })
   .catch((err) => {
      console.error('Error loading cards:', err);
   });

function toggleModal() {
   modalAuth.classList.toggle('is-open');
   document.body.classList.toggle('remove-scroll');

   loginInput.classList.remove('required');
   passInput.classList.remove('required');
   mes.classList.add('hide');
}

buttonAuth.addEventListener('click', toggleModal);

closeModalButton.addEventListener('click', toggleModal);

modalAuth.addEventListener('click', (event) => {
   if (event.target === modalAuth) {
      toggleModal();
   }
});

function logIn(event) {
   event.preventDefault();

   const login = loginInput.value.trim();
   if (login === '') {
      loginInput.classList.add('required');
      passInput.classList.add('required');
      mes.classList.remove('hide');
      return;
   }

   localStorage.setItem('nameParametr', login);

   userName.textContent = login;
   userName.style.display = 'inline';

   buttonAuth.style.display = 'none';
   buttonLogout.style.display = 'flex';

   toggleModal();
   logInForm.reset();
   loginInput.style.border = '';
}

logInForm.addEventListener('submit', logIn);

document.addEventListener('DOMContentLoaded', function () {
   const savedLogin = localStorage.getItem('nameParametr');

   if (savedLogin) {
      userName.textContent = savedLogin;
      userName.style.display = 'inline';
      buttonAuth.style.display = 'none';
      buttonLogout.style.display = 'flex';
   } else {
      buttonAuth.style.display = 'flex';
      buttonLogout.style.display = 'none';
   }
});

function logout() {
   localStorage.removeItem('nameParametr');
   userName.textContent = '';
   userName.style.display = 'none';

   buttonAuth.style.display = 'flex';
   buttonLogout.style.display = 'none';
}

buttonLogout.addEventListener('click', logout);

restaurantList.addEventListener('click', function (event) {
   const card = event.target.closest('.card-restaurant');
   if (card) {
      const savedLogin = localStorage.getItem('nameParametr');

      if (savedLogin) {
         window.location.href = 'restaurant.html';
      } else {
         toggleModal();
         event.preventDefault();
      }
   }
});