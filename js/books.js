function goBack() {
	window.history.back(); // 返回上一页
}
document.getElementById('buy').addEventListener('click', function() {
	const linkpath = window.location.href;
	const img = document.getElementById("img");
	const tit = document.getElementById("tit").textContent;
	const text = document.getElementById("text").textContent;
	const outtime=document.getElementById("outtime").textContent;
	const bookkind=document.getElementById("bookkind").textContent;
	// 提取ID和价格
	// 按文件名精确取商品号（如 bookinfo1.html -> "1"）；
	// 原写法 match(/\d+/) 取的是 URL 中的第一段数字，在 http://localhost:8080/... 下会取到端口号 "8080"
	const idMatch = linkpath.match(/bookinfo(\d+)/i);
	const id = idMatch ? idMatch[1] : 'unknown'; // 确保id是一个字符串
	const priceMatch = text.match(/\d+\.\d{2}/); // 假设价格格式为XX.XX
	const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
	const product = {
		id: id,
		link: linkpath,
		image: img.src,
		title: tit,
		contact: text,
		price:price, // 添加价格到商品对象
		quantity: 1,
		outtime:outtime.substring(5),
		bookkind:bookkind.substring(3),
	};

	addToCart(product);
});

function addToCart(product) {
	// 添加加载状态
	const buyBtn = document.getElementById('buy');
	const originalText = buyBtn.querySelector('h3').textContent;

	let cart = JSON.parse(localStorage.getItem('cart')) || [];

	// 检查购物车中是否已有相同商品
	const existingProductIndex = cart.findIndex(item =>
		item.id === product.id && item.contact === product.contact
	);

	if (existingProductIndex !== -1) {
		// 如果商品已存在，增加数量
		cart[existingProductIndex].quantity += product.quantity;
	} else {
		// 否则，添加新商品
		cart.push(product);
	}

	localStorage.setItem('cart', JSON.stringify(cart));
	buyBtn.querySelector('h3').textContent = '添加中...';
	buyBtn.disabled = true;
	// 恢复按钮状态
	setTimeout(() => {
		alert("商品添加成功");
		buyBtn.querySelector('h3').textContent = originalText;
		buyBtn.disabled = false;
	}, 1000);
}

/* 把当前页所有商品整理进 localStorage 的 allBooks 字段。
   原实现引用了 #buy 回调里的局部变量（id/linkpath/img/tit/text/price/outtime/bookkind），
   在该作用域并不存在，一旦被调用就会抛 ReferenceError；现改为从 DOM 节点上读取。 */
function updateAllBooksInLocalStorage() {
	const books = document.querySelectorAll('.goods a');
	const allBooks = [];

	books.forEach(book => {
		const img = book.querySelector('img');
		const title = book.querySelector('h3');
		const priceText = book.querySelector('p');
		const priceMatch = priceText ? priceText.textContent.match(/\d+\.\d{2}/) : null;

		allBooks.push({
			id: book.getAttribute('data-id') || '',
			link: book.getAttribute('href') || '',
			image: img ? img.src : '',
			title: title ? title.textContent.trim() : '',
			contact: priceText ? priceText.textContent.trim() : '',
			price: priceMatch ? parseFloat(priceMatch[0]) : 0,
			quantity: 1,
			outtime: book.getAttribute('data-time') || '',
			bookkind: book.getAttribute('data-category') || ''
		});
	});

	localStorage.setItem('allBooks', JSON.stringify(allBooks));
}