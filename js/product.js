document.addEventListener('DOMContentLoaded', function() {
    // 加载购物车商品
    loadCartItems();
    
    // 加载总价
    loadSumPrice();
    
    // 提交订单
    document.getElementById('submitOrder').addEventListener('click', submitOrder);
    
    // 关闭模态框
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
        // 提交后可以跳转到首页或其他页面
        window.location.href = '../pages/home.html';
    });
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h3>${item.title}</h3>
                </div>
                <div class="item-price">
                    ¥${(item.price * item.quantity).toFixed(2)} × ${item.quantity}
                </div>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
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
        <div class="total-price">
            <h2>总计：¥${totalPrice.toFixed(2)}</h2>
        </div>
    `;
}

function submitOrder() {
    // 验证表单
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!username || !phone || !address) {
        alert('请填写完整的收货信息');
        return;
    }
    
    // 获取购物车商品
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('购物车为空，请先添加商品');
        return;
    }
    
    // 创建订单对象
    const order = {
        id: generateOrderId(), // 生成唯一订单ID
        username,
        phone,
        address,
        items: cart,
        totalPrice: calculateTotalPrice(cart),
        orderDate: new Date().toISOString(),
        status: 'pending' // 可以设置为'paid'如果需要模拟已支付状态
    };
    
    // 保存订单到localStorage（实际应用中应该发送到服务器）
    saveOrderToLocalStorage(order);
    
    // 显示成功模态框
    showSuccessModal();
    
    // 清空购物车
    localStorage.removeItem('cart');
}

function calculateTotalPrice(cart) {
    let total = 0;
    cart.forEach(item => {
        if (item.price) {
            total += item.price * item.quantity;
        }
    });
    return total;
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
}

// 生成唯一订单ID的函数
function generateOrderId() {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
}

// 保存订单到localStorage的函数
function saveOrderToLocalStorage(order) {
    // 获取现有订单（如果有）
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // 添加新订单
    orders.push(order);
    
    // 保存回localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}