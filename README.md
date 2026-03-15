# BiliMind-Pro
A browser extension for digital mindfulness, helping users reflect on videos watched on Bilibili.
# BiliMind Pro - 视频思绪录 📝

**BiliMind Pro** 是一款专为“数字正念（Digital Mindfulness）”设计的浏览器插件。它旨在通过强制性的反馈机制，将碎片化的视频观看（多巴胺获取）转化为结构化的知识沉淀与深度反思。

## ✨ 核心功能

* **智能播放监控**：根据视频时长（30s/1min 分界线）自动判定记录逻辑。短视频静默存档为“碎片放松”，长视频触发深度反思弹窗。
* **液态玻璃 UI**：采用极致透亮的毛玻璃材质（Liquid Glass），支持液态玻璃、纯净白色、暗夜深邃三种主题自由切换。
* **Apple 风格统计**：内置“今日正念圆环”和“30日深度思考活跃趋势图”，可视化你的每日思考频率。
* **物理防抖交互**：引入“固定热区容器”方案，彻底解决了悬浮按钮在边缘位置的疯狂抖动问题。
* **本地数据存档**：所有记录均存储在浏览器本地，支持一键导出 CSV 文件，方便进一步的数据分析。

## 📸 界面预览

| 深度记录弹窗 | 思绪日志统计 | 主题切换面板 |
| :--- | :--- | :--- |
| ![记录弹窗预览](https://github.com/xuejiehsuej/BiliMind-Pro/raw/main/screenshots/modal.png) | ![日志统计预览](https://github.com/xuejiehsuej/BiliMind-Pro/raw/main/screenshots/options.png) | ![设置面板预览](https://github.com/xuejiehsuej/BiliMind-Pro/raw/main/screenshots/popup.png) |


## 🚀 安装指南

1.  **下载项目**：点击仓库右上角的 `Code` -> `Download ZIP` 并解压，或使用 `git clone`。
2.  **管理扩展程序**：打开 Chrome 或 Edge 浏览器，进入扩展程序页面（地址栏输入 `chrome://extensions` 或 `edge://extensions`）。
3.  **开启开发者模式**：勾选页面右上角的“开发者模式”。
4.  **加载插件**：点击“加载解压的扩展程序”，选择本项目所在的文件夹。
5.  **开始使用**：打开 Bilibili 观看视频，体验数字正念记录。

## 🛠️ 技术实现

* **架构**：Chrome Manifest V3
* **交互**：原生 JavaScript (Vanilla JS) & 响应式标签联动引擎
* **视觉**：CSS3 (Backdrop-filter 毛玻璃滤镜)

## 📜 开源协议

本项目采用 **MIT License** 开源。

---
由 **xuejiehsuej** 开发制作
