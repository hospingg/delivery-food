
const restaurantList = document.querySelector('.restaurant-list');

const restaurantNameTitle = document.querySelector('.restaurant-title')
const restaurantPrice = document.querySelector('.price')
const restaurantRate = document.querySelector('.rating')
const restaurantCategory = document.querySelector('.category')

function createCard({ name, image, price, description }) {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = image;
    img.alt = name;
    img.classList.add('card-image');
    card.appendChild(img);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const cardHeading = document.createElement('div');
    cardHeading.classList.add('card-heading');
    const title = document.createElement('h3');
    title.classList.add('card-title', 'card-title-reg');
    title.textContent = name;
    cardHeading.appendChild(title);
    cardText.appendChild(cardHeading);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');
    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('ingredients');
    ingredientsDiv.textContent = description;
    cardInfo.appendChild(ingredientsDiv);
    cardText.appendChild(cardInfo);

    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-buttons');
    
    const button = document.createElement('button');
    button.classList.add('button', 'button-primary', 'button-add-cart');
    button.innerHTML = `
        <span class="button-card-text">У кошик</span>
        <span class="button-cart-svg"></span>
    `;

    const priceBold = document.createElement('strong');
    priceBold.classList.add('card-price-bold');
    priceBold.textContent = `${price} ₴`;

    cardButtons.appendChild(button);
    cardButtons.appendChild(priceBold);
    cardText.appendChild(ingredientsDiv);
    cardText.appendChild(cardButtons);
    
    card.appendChild(cardText);
    restaurantList.appendChild(card);
}

function renderProducts(productsFile) {
    console.log(productsFile)
    fetch(`/img/db/${productsFile}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            data.forEach(createCard);
        })
        .catch((err) => {
            console.error('Error loading cards:', err);
        });
}
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        products: params.get('products'),
        restaurantName: params.get('restaurant'),
        category: params.get('category'),
        rating: params.get('rating'),
        price: params.get('price'),
    };
}



function init() {
    const { products, restaurantName, category, rating, price } = getQueryParams();
    console.log(restaurantNameTitle)
    if (products && restaurantName) {
        renderProducts(products);
        restaurantNameTitle.textContent = restaurantName
        restaurantPrice.textContent = `Від ${price} ₴`
        restaurantCategory.textContent = category
        restaurantRate.textContent = rating
    } else {
        console.error('No products file specified.');
    }
}

init();