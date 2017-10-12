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

## 数据库与前后端通讯

### Collection 和 Schema 定义

所有 Collection 定义放在 imports/schema 目录, 每个 Collection 务必定义 Schema 来约束字段, Schema 定义使用 [SimpleSchema](https://github.com/aldeed/meteor-simple-schema), 数据插入数据库前必须通过 schema 校验, 调用校验语句为 `表名.schema.validate(要插入的数据);`

### 前后端通讯

前端出于安全考虑, 已禁止直接操作数据库, 前后端数据交互可通过以下方式

#### 需要持续同步的数据

一般为数据库查询操作, 前端随着数据库数据变化自动的响应式更新UI. 实现方法: 后端通过 `Meteor.publish` 添加数据流, 前端需要该数据的地方通过 `Meteor.subscribe` 订阅该数据流, 然后再执行查询语句即可拿到数据

例如:
```js
// 后端
Meteor.publish('message', () => Message.find({}));
// 前端
Meteor.subscribe('message');
const messages = Message.find({ to }).fetch();
```

#### 单次数据交互

类似传统的后端接口, 前端添加请求参数, 后端处理后返回数据. 我们通过 Meteor "接口" 实现, 后端通过 `Meteor.methods` 定义接口, 前端通过 `Meteor.call` 调用接口并传递参数

例如:
```js
// 
Meteor.methods({
    register(username, password, name) {
        assert(RegexpUtil.phoneNumber.test(username), 400, '无效的手机号码');
        assert(password.length > 0, 400, '密码不能为空');
        assert(name.length > 0, 400, '姓名不能为空');

        const colors = ['#29b6f6', '#f58f47', '#5ad186', '#8b91e8', '#f55b89', '#ffc400'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        const avatarColor = colors[randomIndex];

        return Accounts.createUser({
            username,
            password,
            profile: {
                name,
                avatarColor,
                avatar: '',
            },
        });
    },
});
// 前端
Meteor.call('register', 'username', 'password', 'name', (err) => {
    if (err) {
        return console.error(err.reason);
    }
});
```
