# NERV 图书商城（HTML5 + CSS3 + jQuery）

一个动漫主题的图书电商前端，共 **11 个页面**，覆盖「首页 → 分类 → 商品详情 → 购物车 → 我的订单 → 个人中心 → 搜索」的完整购物动线。

《网页设计基础实训》课程项目，独立完成。

---

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 结构与内容 | HTML5（iframe 多页框架、语义化标签、audio / video 媒体标签） |
| 样式 | CSS3（Flex 布局、CSS 变量、过渡与动画、媒体查询） |
| 交互 | JavaScript (ES5/ES6) + jQuery 3.2.1 |
| 图形绘制 | Canvas 2D（图形验证码） |
| 数据持久化 | localStorage |
| 字体图标 | Font Awesome |

纯静态站点，无构建步骤、无后端依赖，直接双击 `index.html` 即可运行。

---

## 页面清单

| 页面 | 文件 | 说明 |
| --- | --- | --- |
| 框架主页 | `index.html` | iframe 容器 + 登录 / 注册弹层 + 背景音乐 |
| 商城主页 | `pages/home.html` | 轮播、推荐位、商品入口 |
| 图书分类 | `pages/category.html` | 按分类筛选图书 |
| 商品列表 | `pages/product.html` | 带视频背景的商品列表页 |
| 商品详情 ×4 | `pages/bookinfo1~4.html` | 四个商品详情页 |
| 购物车 | `pages/cart.html` | 增删改数量 + 金额实时计算 |
| 我的订单 | `pages/myProduct.html` | 已购 / 已加入清单 |
| 个人中心 | `pages/personInfo.html` | 用户信息展示与编辑 |
| 搜索结果 | `pages/search.html` | 关键词搜索结果页 |

`js/` 下 9 个脚本共约 960 行，`css/` 下 9 个样式表共约 1050 行。

---

## 核心功能

### 1. iframe 免刷新页面切换

`index.html` 作为唯一外壳，导航点击时只切换 iframe 的 `src`，配合 JS 控制的加载动画，避免整页刷新带来的白屏。

### 2. Canvas 图形验证码

登录弹层的验证码不是静态图片，而是用 Canvas 2D 在客户端随机生成：随机字符 + 干扰线条 + 噪点，用户点击可刷新。登录时把用户输入与 `currentCode` 本地比对。

### 3. 购物车与金额计算

用 jQuery 渲染购物车列表，支持商品增删、数量增减，并实时汇总小计与总计；数据写入 localStorage，刷新页面后仍保留。

### 4. 关键词搜索

从输入框取关键词，在图书数据中过滤匹配项并跳转到搜索结果页渲染。

### 5. 双主题一键切换

预设两套配色方案（EVA 配色 / 普通配色），通过切换 `data-theme` 属性与 CSS 变量整站换肤，当前主题存入 localStorage，下次访问自动恢复上次选择。

### 6. 媒体与动效

- 首页整站背景音乐（`<audio autoplay loop>`），提供播放 / 暂停控制
- 商品页视频背景（`<video autoplay muted loop>`）
- 页面加载动画、商品卡片 hover 过渡

### 7. 分类筛选与父页面联动

分类页的「分类 / 筛选」是纯前端筛选：`js/category.js` 给分类项绑定点击，按商品的 `data-category`（分类）与 `data-time`（新品 / 热销）显示或隐藏。

由于整站是 iframe 布局，左侧边栏的分类入口由 `js/index.js` 在框架加载完成后，触发分类页内对应元素的点击，父页面与分类页因此共用同一套筛选逻辑，不必维护两份。分类只设 **小说 / 漫画 / 会展** 三类，且分类页导航、侧边栏入口、商品详情页的「类型」、搜索结果里的分类名四处口径一致——分类依据统一取商品上的 `data-category`。

---

## 快速开始

```bash
# 推荐：本地起一个静态服务
npx serve .
# 或
python -m http.server 8080

# 也可以直接双击 index.html，但见下方说明
```

浏览器访问 `http://localhost:8080`。登录用的账号在 `js/index.js` 内维护的模拟用户数据中，验证码按页面提示输入即可。

> **建议用本地服务打开，不要直接双击 `index.html`。**
> 主题切换、导航高亮依赖父页面通过 `contentDocument` 操作 iframe 内部的样式。在 `file://` 协议下，Chromium 会把每个本地文件视为不透明来源，`contentDocument` 返回 `null`，这些效果会静默失效（页面本身仍能正常浏览）。用 `http://localhost` 打开则一切正常。

---

## 目录结构

```
.
├── index.html                  # 唯一入口（iframe 外壳）
├── pages/                      # 11 个业务页面
├── css/                        # 按页面拆分的样式表
├── js/
│   ├── jquery-3.2.1.min.js
│   ├── index.js                # 登录注册、验证码、主题切换、导航
│   ├── home.js / category.js / product.js / books.js
│   ├── cart.js / myProduct.js / personInfo.js
│   ├── search.js
│   └── load.js                 # 加载动画
├── images/                     # 商品与装饰图
├── audio/                      # 背景音乐（未入库，见下方说明）
└── video/                      # 视频背景（未入库，见下方说明）
```

---

## 关于未入库的音视频素材

仓库通过 `.gitignore` 排除了 `audio/` 与 `video/`：

- `audio/One Last Kiss.flac` 约 62MB
- `video/EVA-新世纪福音战士.mp4` 约 68MB

两者合计约 130MB，是项目体积的 90% 以上。上传会显著拖慢 `git clone`，且这些素材版权不属于本人所有，因此不纳入版本控制。

**本地运行时不受影响**——被忽略的文件仍在你自己电脑上。但如果你把仓库分享给别人，对方 clone 后 **背景音乐和视频背景将无法播放**，需要自备同名素材放到对应目录下，或修改 `index.html` / `pages/product.html` 中的引用路径。

如果你希望它们也进仓库，删掉 `.gitignore` 里的 `audio/` 和 `video/` 两行即可（注意先确认网络与仓库体积）。

---

## 运行截图

> 建议放入 `screenshots/` 目录并在下方引用，例如：
> `![首页](screenshots/home.png)`

- 首页与登录弹层（含 Canvas 验证码）
- 图书分类与商品详情
- 购物车与金额计算
- 双主题效果对比

---

## 已知不足

- **登录是纯前端的。** 账号密码与验证码都在浏览器端比对，没有服务端校验，仅用于演示交互流程，不具备真实的账号安全性。
- **商品数据是写死在 JS 里的。** 没有后端接口与数据库，商品与订单均以静态数组 + localStorage 维护。
- **使用 jQuery 而非现代框架。** 这是课程指定技术栈；用 Vue / React 重写可显著减少手动 DOM 操作与状态同步代码。
- **iframe 方案已过时。** 现代前端更常用单页路由，可避免 iframe 带来的 SEO、前进后退与样式隔离问题。
- **未做移动端适配。** 布局按桌面宽度设计，小屏下会出现横向滚动。
