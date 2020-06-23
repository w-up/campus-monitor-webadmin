### 项目介绍

该项目使用 react hooks + mobx +typescript + antd 技术栈

可参考文档地址
react https://reactjs.org/docs/getting-started.html
mobx-react-lit https://github.com/mobxjs/mobx-react-lite
antd https://3x.ant.design/docs/react/introduce

### 开发&编译

`npm run start` 运行项目

`npm run build` 编译项目

### 项目架构

./src
├── App.tsx 项目入口文件
├── assets //静态资源
├── common //全局变量
├── components //组件
│ └── Template.tsx //组件初始化模板
├── pages //页面
├── config.ts // 配置文件
├── services // api 接口
├── stores //mobx 全局数据管理累
├── AuthStore.ts 用户鉴权数据
│ ├── index.ts // 数据管理入口
├── type.ts // 自定义类型
├── utils //工具库
├── App.scss 全局 css
└── variable.scss // 全局 css 变量
