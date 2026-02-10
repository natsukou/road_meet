# RoadMeet - GPS社交交友线下聚会应用

基于GPS的社交交友线下聚会H5应用，帮助两个用户找到彼此中间的有趣地点进行线下见面。

## 功能特性

- 📱 手机号注册/登录（模拟验证码：123456）
- 🤝 创建/加入见面任务（16进制代号匹配）
- 📍 GPS定位共享
- 🗺️ 中间点计算与地图展示
- ☕ 推荐见面地点（咖啡、餐厅、书店、公园等）
- 📝 见面任务管理（编辑限制、取消确认）

## 快速开始

### 方式一：直接打开（最简单）
直接打开 `frontend/dist/index.html` 文件即可使用，无需服务器。

### 方式二：本地开发
```bash
cd frontend
npm install
npm run dev
```
访问 http://localhost:3000

### 方式三：GitHub Pages 部署
1. Fork 或克隆本仓库到您的 GitHub
2. 进入仓库 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 自动部署完成后访问 `https://您的用户名.github.io/road_meet`

## 使用说明

1. **注册/登录**：使用任意手机号 + 验证码 123456
2. **创建见面**：点击"创建见面"生成唯一代号（如 #A3F9B2）
3. **分享代号**：将代号告诉对方
4. **加入见面**：对方输入代号加入任务
5. **共享位置**：双方点击"共享我的位置"
6. **查看地图**：位置共享后查看中间点和推荐地点

## 技术栈

- Next.js 14 + React 18
- TypeScript
- Tailwind CSS
- LocalStorage 数据存储（纯前端，无需后端）

## 项目结构

```
.
├── frontend/           # Next.js 前端项目
│   ├── src/
│   │   ├── app/       # 页面路由
│   │   ├── components/# 组件
│   │   ├── hooks/     # 自定义 Hooks
│   │   ├── utils/     # 工具函数
│   │   └── types/     # TypeScript 类型
│   └── dist/          # 静态导出文件
├── PRD.md             # 产品需求文档
├── TODO.md            # 开发任务清单
└── README.md          # 项目说明
```

## 注意事项

- 本项目使用浏览器 LocalStorage 存储数据，刷新页面数据不会丢失
- GPS 定位需要浏览器权限授权
- 验证码固定为 123456（演示用途）
- 地图使用模拟数据展示（未接入真实地图 API）

## License

MIT
