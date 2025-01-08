

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, child, get, push, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC--djFCg91EBEK_GnTXpVn3HSJDSfoaLw",
    authDomain: "delivery-food-d25c7.firebaseapp.com",
    databaseURL: "https://delivery-food-d25c7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "delivery-food-d25c7",
    storageBucket: "delivery-food-d25c7.firebasestorage.app",
    messagingSenderId: "559618142327",
    appId: "1:559618142327:web:9e7df6562f7b473b371672"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

// Елементи DOM
const cartButton = document.getElementById('cart-button');
const modalCart = document.querySelector('.modal-cart');
const modalBody = modalCart.querySelector('.modal-body');
const modalPricetag = modalCart.querySelector('.modal-pricetag');
const clearCartButton = modalCart.querySelector('.clear-cart');
const cartQuantity = document.querySelector('#card-quantity')
const confirmOrderbtn = document.querySelector('#confirm-order')
const phoneModal = document.querySelector('.phone-modal')

let totalQuantity = 0
// Ключ для збереження даних у localStorage
const CART_STORAGE_KEY = 'cart';
updateTotalQuantity()
// Отримати дані з localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

// Зберегти дані в localStorage
function saveCartItems(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Оновлення кількості товарів у кошику
function updateTotalQuantity() {
    const cart = getCartItems();
    totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartQuantity.textContent = totalQuantity;
}

// Оновлення відображення кошика
function updateCartDisplay() {
    const cartItems = getCartItems();
    const phoneNumberInfo = document.querySelector('#phone-number')
    updateTotalQuantity()
    modalBody.innerHTML = '';
    let total = 0;
    confirmOrderbtn.disabled = false
    confirmOrderbtn.classList.remove('disabled')
    phoneNumberInfo.classList.remove('required')
    phoneModal.classList.remove('hidden')

    if(totalQuantity === 0 ){
        console.log(cartItems)
        const emptyMes = document.createElement('div');
        emptyMes.innerHTML = `
            <span class="food-name">Уппс, а тут пусто</span>
        `;
        confirmOrderbtn.disabled = true
        confirmOrderbtn.classList.add('disabled')
        phoneModal.classList.add('hidden')
        modalBody.appendChild(emptyMes);
    }

    cartItems.forEach(({ name, price, quantity }, index) => {
        const foodRow = document.createElement('div');
        foodRow.classList.add('food-row');

        foodRow.innerHTML = `
            <span class="food-name">${name}</span>
            <strong class="food-price">${price * quantity} ₴</strong>
            <div class="food-counter">
                <button class="counter-button" data-index="${index}" data-action="decrease">-</button>
                <span class="counter">${quantity}</span>
                <button class="counter-button" data-index="${index}" data-action="increase">+</button>
            </div>
        `;

        modalBody.appendChild(foodRow);
        total += price * quantity;
    });

    modalPricetag.textContent = `${total} ₴`;
    updateTotalQuantity(); // Оновлюємо загальну кількість товарів
}

// Додавання товару до кошика
function addToCart(product) {
    let cart = getCartItems();
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartItems(cart);
    updateCartDisplay();
}

// Обробка кнопок у кошику
function handleCartButtonClick(event) {
    const button = event.target;

    if (button.classList.contains('counter-button')) {
        const cart = getCartItems();
        const itemIndex = parseInt(button.dataset.index, 10);
        const action = button.dataset.action;

        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity -= 1;

            if (cart[itemIndex].quantity === 0) {
                cart.splice(itemIndex, 1);
            }
        }

        saveCartItems(cart);
        updateCartDisplay();
    }
}

// Очистити кошик
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartDisplay();
}

// Відкрити кошик
function openCart() {
    modalCart.classList.add('is-open');
    updateCartDisplay();
}


// Закрити кошик
function closeCart() {
    modalCart.classList.remove('is-open');
}
// Ініціалізація подій
cartButton.addEventListener('click', openCart);
modalCart.addEventListener('click', (event) => {
    if (event.target.classList.contains('close') || event.target === modalCart) {
        closeCart();
    }
});
modalBody.addEventListener('click', handleCartButtonClick);
clearCartButton.addEventListener('click', clearCart);

document.addEventListener('DOMContentLoaded', () => {
    const addCartButtons = document.querySelectorAll('.button-add-cart');

    addCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.card');
            const name = card.querySelector('.card-title').textContent;
            const price = parseInt(card.querySelector('.card-price-bold').textContent, 10);

            addToCart({ name, price });
        });
    });

    updateCartDisplay();
});

document.addEventListener('click', (event) => {
    if (event.target.closest('.button-add-cart')) {
        const card = event.target.closest('.card');
        const name = card.querySelector('.card-title').textContent;
        const price = parseInt(card.querySelector('.card-price-bold').textContent.replace('₴', '').trim());
        const description = card.querySelector('.ingredients').textContent;

        addToCart({ name, price, description });
    }
});

// Функція для збереження замовлення у Firebase
function saveOrderToFirebase(orderInfo) {
    // Отримуємо посилання на вузол 'ordersInfo' у базі даних Firebase
    const answersRef = ref(db, 'ordersInfo');

    // Додаємо нове замовлення у Firebase
    push(answersRef, orderInfo)
        .then(() => {
            // Якщо замовлення успішно збережено
            console.log("Замовлення успішно збережено у Firebase.");
            
            // Очищаємо корзину після успішного збереження
            clearCart();

            // Закриваємо вікно корзини
            closeCart();

            // Виводимо повідомлення користувачеві про успішне оформлення замовлення
            alert('Вітаємо, ваше замовлення успішно оформлено');
        })
        .catch(error => {
            // Виводимо помилку у консоль, якщо щось пішло не так
            console.error("Помилка збереження замовлення:", error);
        });
}

// Функція для підтвердження замовлення
function confirmOrder() {
    // Отримуємо поле вводу номера телефону
    const phoneNumberInfo = document.querySelector('#phone-number');
    console.log(phoneNumberInfo); // Лог для перевірки, чи правильно отримано елемент

    // Отримуємо товари з корзини
    const order = getCartItems();

    // Перевіряємо, чи заповнено номер телефону
    if (!phoneNumberInfo.value) {
        // Якщо номер телефону не вказано, додаємо клас 'required' для відображення помилки
        phoneNumberInfo.classList.add('required');
    } else {
        // Якщо номер телефону введено, формуємо об'єкт замовлення
        const orderInfo = {
            userInfo: {
                // Отримуємо ім'я користувача з локального сховища
                name: localStorage.getItem('nameParametr'),

                // Зберігаємо введений номер телефону
                contacts: phoneNumberInfo.value,
            },
            // Додаємо товари з корзини
            order,
        };

        // Викликаємо функцію для збереження замовлення у Firebase
        saveOrderToFirebase(orderInfo);
    }
}

// Додаємо обробник події кліку для кнопки підтвердження замовлення
confirmOrderbtn.addEventListener('click', confirmOrder);
