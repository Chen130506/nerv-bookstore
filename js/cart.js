function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <a href="${item.link}">
                    <img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>${item.contact}</p>
                </a>
                <div class="quantity-control">
                    <button onclick="decreaseQuantity('${item.id}', '${item.contact}')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.id}', '${item.contact}')">+</button>
                </div>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
    loadSumPrice();
}

function increaseQuantity(id, contact) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => 
        item.id === id && item.contact === contact
    );

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function decreaseQuantity(id, contact) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => 
        item.id === id && item.contact === contact
    );

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}
function loadSumPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;
    
    cart.forEach(item => {
        if (item.price) {
            totalPrice += item.price * item.quantity;
        }
    });
    
    const sumPriceDiv = document.getElementById('sumprice');
    sumPriceDiv.innerHTML = `
        <h1>合计：¥${totalPrice.toFixed(2)}</h1>
    `;
}
// 页面加载时显示购物车内容
window.addEventListener('DOMContentLoaded', loadCart);