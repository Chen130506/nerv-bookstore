function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示选中的页面
    document.getElementById(pageId + '-page').classList.add('active');
    
    // 更新导航菜单激活状态
    document.querySelectorAll('.list-button li').forEach(li => {
        li.classList.remove('active'); // 先移除所有菜单项的激活状态
    });
    
    // 为当前点击的菜单项添加激活状态
    event.target.classList.add('active');
}