function filterGoods(category = null, filter = null) {
    const goods = document.querySelectorAll('.goods a');
    goods.forEach(good => {
        const goodCategory = good.getAttribute('data-category');
        const goodTime = good.getAttribute('data-time');

        let show = true;

        if (category && goodCategory !== category) {
            show = false;
        }

        if (filter && goodTime !== filter) {
            show = false;
        }

        good.style.display = show ? 'block' : 'none';
    });
}

/* 「综合」：清空分类与筛选条件，恢复显示全部商品 */
function showAllGoods() {
    const cateLinks = document.querySelectorAll('.category a[data-category]');
    const selLinks = document.querySelectorAll('.select a');
    cateLinks.forEach(l => l.classList.remove('active'));
    selLinks.forEach(l => l.classList.remove('active'));
    filterGoods();
}

document.addEventListener('DOMContentLoaded', function() {
    /* 只选取带 data-category 的分类链接：
       原先的 '.category div' 会把「分类」标题（.ctgy）也绑上点击事件 */
    const cateLinks = document.querySelectorAll('.category a[data-category]');
    /* 只选取筛选区的链接，避免把「筛选」标题（.slt）也算作筛选项 */
    const selLinks = document.querySelectorAll('.select a');

    cateLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            cateLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            /* 分类名取自 <a> 的 data-category，与商品上的 data-category 使用同一套英文值；
               原先取的是内层 div 的 id（拼音），与商品的 data-category 永不相等，会把商品全部隐藏 */
            filterGoods(this.dataset.category, null);
        });
    });

    selLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            selLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const inner = this.querySelector('div');
            const key = inner ? inner.id : '';
            /* 「综合」不带 id，视为不筛选；「时间」按 data-time="new" 筛新品 */
            const filter = key === 'time' ? 'new' : (key || null);
            filterGoods(null, filter);
        });
    });
});
