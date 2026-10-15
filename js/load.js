document.addEventListener('DOMContentLoaded', function() {
    // 模拟加载完成
	$("#main").hide();
    setTimeout(function() {
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.style.display = 'none';
        
        // 显示页面内容
        document.body.style.overflow = 'auto';
		$("#main").show();
    }, 2000); // 3秒后隐藏加载动画
});