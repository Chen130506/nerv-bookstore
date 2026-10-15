document.addEventListener('DOMContentLoaded', function() {
	const slider = document.querySelector('.slider');
	const images = document.querySelectorAll('.slider img');
	const dots = document.querySelectorAll('.circle li');
	let currentIndex = 0;
	const totalImages = images.length;

	// 自动轮播
	function autoSlide() {
		currentIndex = (currentIndex + 1) % totalImages;
		updateSlider();
	}

	function appendTime() {
		const pElement = document.querySelector('.marquee span');
		// 获取当前时间
		const now = new Date();

		// 格式化时间（可以根据需要调整格式）
		const currentTime = now.toLocaleString(); // 例如: "2023/10/5 下午3:24:56"

		// 追加时间和文字
		pElement.textContent = " 当前时间: " + currentTime;
	}
	let slideInterval = setInterval(autoSlide, 3000);
	// 更新滑块和圆点状态
	let addtime = setInterval(appendTime, 1000);

	function updateSlider() {
		slider.style.transform = `translateX(-${currentIndex * 600}px)`;

		dots.forEach((dot, index) => {
			if (index === currentIndex) {
				dot.classList.add('active');
			} else {
				dot.classList.remove('active');
			}
		});
	}

	// 点击圆点切换图片
	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			currentIndex = index;
			updateSlider();
			// 重置自动轮播计时器
			clearInterval(slideInterval);
			slideInterval = setInterval(autoSlide, 3000);
		});
	});

	// 鼠标悬停时暂停轮播
	slider.addEventListener('mouseenter', () => {
		clearInterval(slideInterval);
	});

	// 鼠标离开时恢复轮播
	slider.addEventListener('mouseleave', () => {
		clearInterval(slideInterval);
		slideInterval = setInterval(autoSlide, 3000);
	});

});
document.addEventListener('mousemove', (e) => {
	// 将鼠标事件发送到父页面
	window.parent.postMessage({
		type: 'mousemove',
		x: e.clientX,
		y: e.clientY
	}, '*');
});