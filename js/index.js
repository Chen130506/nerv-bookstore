function showLoginError(message) {
	$(".login-error").text(message).show();
}

function showRegError(message) {
	$(".reg-error").text(message).show();
}
function builderRandom() { //返回一个随机字符
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz23456789';
	return chars.charAt(Math.floor(Math.random() * chars.length));
}

function makeText() { //生成4个随机字符
	let randomText = '';
	for (let i = 0; i < 4; i++) {
		randomText += builderRandom();
	}
	return randomText;
}

function drawcode() {
	/*绘制验证码*/
	const canvas = document.getElementById("codeid");
	if (!canvas) {
		alert("Canvas element not found");
		return;
	}
	const ctx = canvas.getContext('2d');
	const randomText = makeText();
	// 清空画布  
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 填充背景  
	ctx.fillStyle = '#f0f0f0';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.font = '100px 微软雅黑';
	ctx.fillStyle = '#333';
	ctx.textBaseline = 'top';
	for (let i = 0; i < randomText.length; i++) {
		ctx.save();
		ctx.translate(i * 70 + 10, 40);
		ctx.rotate(Math.random() * 0.4 - 0.2);
		ctx.fillText(randomText[i], 0, 0);
		ctx.restore();
	}
	for (let i = 0; i < 100; i++) {
		ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
		ctx.beginPath();
		ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 4, 0, Math.PI * 2);
		ctx.fill();
	}
	currentCode = randomText.toLowerCase(); // 统一转为小写
	return randomText;
}

function removeActiveClass(link) {
	const frame = document.getElementById('contentFrame');
	if (!frame) return;
	// link 由内联 onclick 以 this 传入；若未传入则退回分类页，
	// 避免 frame.src 被赋成 undefined（原写法用 this.href，而内联属性里的 this 是 window）
	frame.src = (link && link.href) ? link.href : 'pages/category.html'; // 在框架中加载目标页面
	frame.onload = function() {
		try {
			// 确保框架内容已加载，然后操作DOM
			const timelink = frame.contentDocument.getElementById('time');
			if (timelink) {
				timelink.classList.remove('active'); // 添加active类
			} else {
				console.error('未找到id为"time"的元素');
			}
		} catch (error) {
			console.error('无法访问框架内容:', error);
		}
	};
}
document.addEventListener('DOMContentLoaded', function() {
	// 获取所有导航链接
	const navLinks = document.querySelectorAll('.nav a');
	const newslink = document.getElementById("news");
	const frame = document.getElementById('contentFrame');
	// 为每个链接添加点击事件监听器
	const themeButtons = document.querySelectorAll('.btn-theme');
	const root = document.documentElement;

	// 定义主题配置
	const themes = {
		eva: {
			'--primary-color': '#D7000F',
			'--secondary-color': '#5E007F',
			'--text-color': '#E0E0E0',
			'--dark-bg': '#1A1A1A',
			'--mid-bg': '#2A2A2A'
		},
		normal: {
			'--primary-color': '#4285F4',
			'--secondary-color': '#34A853',
			'--text-color': '#333333',
			'--dark-bg': '#FFFFFF',
			'--mid-bg': '#F5F5F5'
		}
	};
	const audio = document.getElementById('bgMusic');
	const toggleBtn = document.getElementById('toggleMusic');
	const statusText = document.getElementById('musicStatus');
	// 尝试自动播放音频
	function playAudio() {
		if (!audio || !statusText || !toggleBtn) return;

		const promise = audio.play();

		if (promise !== undefined) {
			// 注意：catch() 返回的是「已解决」的 Promise，
			// 原写法 .catch(...).then(...) 会让成功分支在失败后照样执行，把状态文字又改回「播放中」
			promise.then(() => {
				// 播放成功
				statusText.textContent = '音乐播放中...';
			}).catch(error => {
				// 自动播放被阻止时的处理
				console.log('自动播放被阻止:', error);
				statusText.textContent = '点击播放按钮开始音乐';
				toggleBtn.textContent = '播放';
			});
		}
	}

	// 页面加载后尝试播放
	playAudio();

	// 切换播放/暂停状态
	toggleBtn.addEventListener('click', function() {
		if (audio.paused) {
			audio.play();
			statusText.textContent = '音乐播放中...';
			toggleBtn.textContent = '暂停';
		} else {
			audio.pause();
			statusText.textContent = '音乐已暂停';
			toggleBtn.textContent = '播放';
		}
	});
	// 为每个按钮添加点击事件
	themeButtons.forEach(button => {
		button.addEventListener('click', function() {
			// 移除所有按钮的active类
			themeButtons.forEach(btn => btn.classList.remove('active'));

			// 为当前点击的按钮添加active类
			this.classList.add('active');

			// 获取选择的主题
			const theme = this.getAttribute('data-theme');
			const selectedTheme = themes[theme];
			if (!selectedTheme) return;

			// 记住用户的选择（iframe 每次重新加载后由下方 load 事件读取并恢复；
			// 原代码只读不写，导致每切换一次导航页主题都被重置回默认的 eva）
			localStorage.setItem('selectedTheme', theme);

			// 修改主文档的CSS变量
			Object.keys(selectedTheme).forEach(key => {
				root.style.setProperty(key, selectedTheme[key]);
			});

			// 修改iframe中的CSS变量（如果iframe已加载）
			if (frame && frame.contentDocument) {
				const iframeRoot = frame.contentDocument.documentElement;
				Object.keys(selectedTheme).forEach(key => {
					iframeRoot.style.setProperty(key, selectedTheme[key]);
				});
			}
		});
	});
	frame.addEventListener('load', function() {
		const savedTheme = localStorage.getItem('selectedTheme') || 'eva'; // 默认主题
		const savedButton = document.querySelector(`.btn-theme[data-theme="${savedTheme}"]`);
		if (savedButton) {
			savedButton.click();
		}
	});
	navLinks.forEach(link => {
		link.addEventListener('click', function() {
			// 移除所有链接的 active 类
			navLinks.forEach(l => l.classList.remove('active'));
			// 为当前点击的链接添加 active 类
			this.classList.add('active');
		});
	});
	/* 侧边栏分类入口与顶栏「新品」：加载分类页后，在 iframe 内部触发对应项的点击，
	   由 category.js 完成真正的筛选与高亮。
	   抽成公共函数的原因：原先 novel / comic / 新品 各写一段几乎相同的代码；
	   而且给 frame.src 赋一个相同的地址不会重新触发 load 事件，导致"人已经在分类页时，
	   再点另一个分类"没有任何反应（此时不走 load，也就没人去操作 iframe 内部）。 */
	function activateInFrame(elementId) {
		const run = function() {
			try {
				const elementInFrame = frame.contentDocument.getElementById(elementId);
				if (elementInFrame) {
					/* 直接触发点击，而不是只加 active 类：
					   category.js 的监听绑定在 <a> 上，点击会冒泡到 <a> 并执行真正的筛选 */
					elementInFrame.click();
				} else {
					console.error('未找到id为"' + elementId + '"的元素');
				}
			} catch (error) {
				console.error('无法访问框架内容:', error);
			}
		};

		/* file:// 协议下读取 contentWindow.location 可能被浏览器拦截，故单独包一层 */
		let currentPath = '';
		try {
			currentPath = frame.contentWindow ? frame.contentWindow.location.pathname : '';
		} catch (error) {
			console.error('无法读取框架地址:', error);
		}

		if (currentPath.indexOf('category.html') !== -1) {
			run();  // 已在分类页，直接筛选
		} else {
			frame.src = 'pages/category.html';
			frame.onload = run;
		}
	}

	/* iframe 是否可被父页面操作。
	   file:// 协议下 Chromium 会把本地文件视为不透明来源，contentDocument 为 null
	   （详见 README「运行说明」）。此时不去拦截浏览器的默认跳转，
	   让 <a target="contentFrame"> 照常加载分类页，至少保留基本的跳转效果。 */
	function canDriveFrame() {
		try {
			return !!(frame.contentDocument && frame.contentWindow);
		} catch (error) {
			return false;
		}
	}

	/* 左侧分类链接 -> 分类页中对应分类项的元素 id */
	[['novel', 'xiaoshuo'], ['comic', 'manhua'], ['exhibition', 'huizhan']].forEach(function(pair) {
		const link = document.getElementById(pair[0]);
		if (link) {
			link.addEventListener('click', function(e) {
				/* 能操作 iframe 时接管导航：否则浏览器的默认跳转会把刚筛选好的分类页
				   重新加载一遍，把筛选结果冲掉（点同一分类反复点尤为明显） */
				if (canDriveFrame()) e.preventDefault();
				activateInFrame(pair[1]);
			});
		}
	});

	newslink.addEventListener('click', function(e) {
		if (canDriveFrame()) e.preventDefault();
		activateInFrame('time');  // 「新品」= 筛选区的「时间」，对应 data-time="new"
	});

	/* 顶部搜索框：把关键词交给搜索页，search.js 会读取并自动执行一次搜索
	   （原代码里 #search 的值从未被读取，用户输入的关键词会被静默丢弃） */
	const searchInput = document.getElementById('search');
	const searchBtn = document.getElementById('search-btn');
	function goSearch() {
		const keyword = searchInput ? searchInput.value.trim() : '';
		if (!keyword) {
			alert('请输入搜索关键词');
			if (searchInput) searchInput.focus();
			return;
		}
		localStorage.setItem('nerv-search-keyword', keyword);
		frame.src = 'pages/search.html';
	}
	if (searchBtn) searchBtn.addEventListener('click', goSearch);
	if (searchInput) {
		searchInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') goSearch();
		});
	}
});
var currentCode = ''; /*保存验证码*/
$(document).ready(function() {
	$("#back").click(function() {
		$(".logonbox").css("visibility", "hidden");
		$(".on").css("visibility", "hidden");
		$(".creat").css("visibility", "hidden");
	})
	const users = JSON.parse(localStorage.getItem('nerv-users')) || {}; /*创建字典用于存储用户信息*/
	let currentUser = null; /*创建用户信息*/
	let currentTheme = 'eva'; /*创建主题*/
	/*显示登录框*/
	$(".logon").mousedown(function() {
		$(".logonbox").css("visibility", "visible");
		$(".on").css("visibility", "visible");
		drawcode();
		$(".login-error").hide();
		$(".reg-error").hide();
	});
	/*显示注册框*/
	$("#show-register").click(function(e) {
		e.preventDefault(); /*阻止默认行为*/
		$(".on").css("visibility", "hidden");
		$(".creat").css("visibility", "visible");
		$(".reg-error").hide();
	});
	/*返回登录框*/
	$("#show-login").click(function(e) {
		e.preventDefault();
		$(".creat").css("visibility", "hidden");
		$(".on").css("visibility", "visible");
		$(".reg-error").hide();
	});
	/*注册功能*/
	$("#register-btn").click(function() {
		const username = $("#reg-user").val().trim(); /*获取注册的用户名*/
		const password = $("#reg-pwd").val(); /*获取注册的密码(没有去空格)*/
		const confirmPwd = $("#reg-pwd-ag").val(); /*获取再次输入的密码*/

		// 验证输入
		if (!username || !password || !confirmPwd) {
			showRegError("所有字段都必须填写");
			return;
		}

		if (password !== confirmPwd) {
			showRegError("两次输入的密码不一致");
			return;
		}

		if (password.length < 6) {
			showRegError("密码长度不能少于6位");
			return;
		}

		if (users[username]) {
			/*users在网页加载时被定义为字典{}，users[username]可用于判断用户名是否已经被注册*/
			showRegError("用户名已存在");
			return;
		}

		// 注册成功
		users[username] = {
			password: password,
			// 可以添加更多用户信息
		};

		localStorage.setItem('nerv-users', JSON.stringify(users));
		alert("注册成功！请登录");
		$(".creat").css("visibility", "hidden");
		$(".on").css("visibility", "visible");
		$("#reg-user").val('');
		$("#reg-pwd").val('');
		$("#reg-pwd-ag").val('');
	});
	/*登录功能*/
	$("#login-btn").click(function() {
		const username = $("#login-user").val().trim(); /*获取用户名*/
		const password = $("#login-pwd").val(); /*获取密码*/
		const code = $("#login-code").val().trim().toLowerCase(); /*获取验证码（去空格）*/

		// 验证输入
		if (!username || !password || !code) {
			showLoginError("所有字段都必须填写");
			return;
		}

		if (code !== currentCode) {
			showLoginError("验证码错误");
			drawcode();
			return;
		}

		if (!users[username]) {
			showLoginError("用户名不存在");
			return;
		}

		if (users[username].password !== password) {
			showLoginError("密码错误");
			return;
		}

		// 登录成功
		currentUser = username;
		updateUserInterface();
		$(".logonbox").css("visibility", "hidden");
		$(".on").css("visibility", "hidden");
		$(".creat").css("visibility", "hidden");
		$(".login-error").hide();
	});
	/*注销功能*/
	$("#logout").click(function(e) {
		e.preventDefault();
		currentUser = null;
		updateUserInterface();
	});
	/*更新用户界面*/
	function updateUserInterface() {
		if (currentUser) {
			$("#name").text(currentUser);
			$(".logon").hide();
			$("#user-area").css("visibility", "visible");
			$(".logonbox").css("visibility", "hidden");
		} else {
			$(".logon").show();
			$("#user-area").css("visibility", "hidden");
			$("#login-user").val('');
			$("#login-pwd").val('');
			$("#login-code").val('');
		}
	}
})