document.addEventListener('DOMContentLoaded', function() {
	// 从本地存储或服务器加载订单
	loadOrders();
});

function loadOrders() {
	// 在实际应用中，这里应该是从服务器获取订单
	// 示例中我们使用本地存储模拟

	// 获取订单数据（实际应用中替换为API调用）
	const orders = getOrdersFromStorage();

	const ordersList = document.getElementById('ordersList');
	const noOrders = document.getElementById('noOrders');

	if (orders.length === 0) {
		noOrders.style.display = 'block';
		ordersList.style.display = 'none';
		return;
	}

	noOrders.style.display = 'none';
	ordersList.style.display = 'block';
	ordersList.innerHTML = '';

	orders.forEach(order => {
		const orderDiv = document.createElement('div');
		orderDiv.className = 'order-item';

		// 订单状态显示（实际应用中根据order.status）
		let statusText = '待支付';
		let statusClass = 'pending';

		// 根据订单状态设置显示文本和样式类
		if (order.status === 'paid') {
			statusText = '已支付';
			statusClass = 'paid';
		} else if (order.status === 'shipped') {
			statusText = '已发货';
			statusClass = 'shipped';
		} else if (order.status === 'completed') {
			statusText = '已完成';
			statusClass = 'completed';
		} else if (order.status === 'cancelled') {
			statusText = '已取消';
			statusClass = 'cancelled';
		}

		// 计算订单总价
		const totalPrice = calculateTotalPrice(order.items);

		// 格式化日期
		const orderDate = new Date(order.orderDate).toLocaleString();

		// 构建订单HTML
		orderDiv.innerHTML = `
            <div class="order-header">
                <span class="order-id">订单号: ${order.id}</span>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            <div class="order-details">
                <p>下单时间: ${orderDate}</p>
                <p>收货人: ${order.username} (${order.phone})</p>
                <p>收货地址: ${order.address}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-info">
                        <img src="${item.image}" alt="${item.title}" width="60" height="60">
                        <div class="order-item-details">
                            <h4>${item.title}</h4>
                            <p>作者: ${item.contact}</p>
                        </div>
                        <div class="item-price">
                            ¥${(item.price * item.quantity).toFixed(2)} × ${item.quantity}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                总计: ¥${totalPrice.toFixed(2)}
            </div>
        `;

		ordersList.appendChild(orderDiv);
	});
}

function calculateTotalPrice(items) {
	let total = 0;
	items.forEach(item => {
		if (item.price) {
			total += item.price * item.quantity;
		}
	});
	return total;
}

// 模拟从本地存储获取订单（实际应用中替换为API调用）
function getOrdersFromStorage() {
	// 在实际应用中，这里应该是从服务器获取订单
	// 示例中我们模拟一些订单数据
	// 从localStorage获取所有订单（如果有）
	let orders = JSON.parse(localStorage.getItem('orders')) || [];
	return orders;
}