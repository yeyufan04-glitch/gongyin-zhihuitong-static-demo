# 工银智汇通静态交互演示

企业货物贸易出口收汇可信智能作业平台的公开静态交互演示版。系统围绕 `GYZHT-2019-001` 运行一份统一 DemoCase，使用浏览器本地 Context + Reducer 回放业务流程，不部署 Node/Python 后端，不在线调用 RapidOCR、Laya 或大模型。

## 运行

```bash
npm install
npm run dev
npm run build
```

GitHub Pages 可使用 GitHub Actions 构建 `dist` 部署。系统使用相对资源路径，适合项目子路径访问。

## 材料

2019 文件夹中的商业发票、装箱单和装运通知用于公开演示原件预览；业务试题未放入企业上传材料。`pacs008-demo.xml` 是明确标注的模拟报文。

页脚边界说明：竞赛原型演示。贸易材料采用教学业务样本，pacs.008、企业分类及业务条件为演示配置，不代表真实工商银行生产数据。
