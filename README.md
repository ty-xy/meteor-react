# e建联-web

## 运行

```
npm start
```

## 代码规范

### 命名

1. 组件名和组件所在文件名使用大驼峰式
2. css类名使用小写单词并用横线(-)分割
3. dom节点以$开头

### 组件

1. 每个组件占一个文件
2. 组件不包含状态则应写为 stateless 组件
3. 非 stateless 组件使用 pure-render-decorator 优化

## 目录结构

.  
├── client  
│   ├── main.html                       客户端页面模板  
│   └── main.js                         客户端入口  
├── imports  
│   ├── client  
│   │   ├── App.jsx                     顶层组件  
│   │   ├── components                  公共组件  
│   │   ├── routers                     前端路由  
│   │   ├── styles                      样式  
│   │   └── views                       视图  
│   │       ├── baike                   百科  
│   │       ├── chat                    聊天  
│   │       ├── header                  公共头  
│   │       ├── login                   登录注册  
│   │       ├── manage                  管理  
│   │       └── project                 项目  
│   ├── schema                          模型  
│   └── util                            工具函数  
├── packages                            自定义 meteor 包  
├── public                              客户端资源  
└── server  
    ├── chat                            聊天接口  
    ├── main.js                         服务端入口  
    └── user                            用户接口  
