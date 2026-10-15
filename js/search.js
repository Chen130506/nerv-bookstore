function initSearch() {
	/* content 的格式为「分类--价格」，其中的分类名需与分类页的导航项、
	   商品详情页的「类型」保持一致（小说 / 漫画 / 会展），否则搜出来的分类会和实际归属对不上 */
	const sampleData = [{
			link: "../pages/bookinfo1.html",
			image: "../images/goods1.jpeg",
			title: "北京·艺术与潮流 遇见EVA",
			content: "小说--￥68.00"
		},
		{
			link: "../pages/bookinfo2.html",
			image: "../images/goods2.jpeg",
			title: "北京·EVA30周年高桥洋子个人巡演",
			content: "小说--￥218.00"
		},
		{
			link: "../pages/bookinfo3.html",
			image: "../images/goods3.jpeg",
			title: "上海·EVA x ANiMEL 主题咖啡店",
			content: "漫画--￥188.00"
		},
		{
			link: "../pages/bookinfo4.html",
			image: "../images/goods4.jpeg",
			title: "深圳·EVANGELION× PrismLand · 新世纪福音战士官方授权主题店",
			content: "会展--￥105.00"
		},
	];

	const searchButton = document.getElementById('search-button');
	const searchInput = document.getElementById('search-input');

	function performSearch() {
		const query = searchInput.value.toLowerCase().trim();
		const resultsContainer = document.getElementById('goods');

		if (!query) {
			resultsContainer.innerHTML = '<p>请输入搜索关键词</p>';
			return;
		}

		const filteredResults = sampleData.filter(item =>
			item.title.toLowerCase().includes(query) ||
			item.content.toLowerCase().includes(query)
		);

		if (filteredResults.length > 0) {
			let html = '';
			filteredResults.forEach(item => {
				html += `
								<a href="${item.link}" class="good">
									<div>
										<img src="${item.image}" alt="${item.title}" />
										<h3>${item.title}</h3>
										<p>${item.content}</p>
									</div>
								</a>
							`;
			});
			resultsContainer.innerHTML = html;
		} else {
			resultsContainer.innerHTML = '<p>没有找到匹配的结果</p>';
		}
	}

	if (searchButton && searchInput) {
		searchButton.addEventListener('click', performSearch);
		searchInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') performSearch();
		});

		/* 若从首页顶部搜索框跳转而来，回填关键词并自动搜索一次 */
		const presetKeyword = localStorage.getItem('nerv-search-keyword');
		if (presetKeyword) {
			searchInput.value = presetKeyword;
			localStorage.removeItem('nerv-search-keyword');
			performSearch();
		}
	}
}

window.addEventListener('DOMContentLoaded', initSearch);