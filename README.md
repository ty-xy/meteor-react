# e建联-web

## 运行

```
npm start
```

## 代码规范
### Commit Message 编写规范
编写Commit Message需要遵循一定的范式，内容应该清晰明了，指明本次提交的目的，便于日后追踪问题。
[规则参照](https://blog.suisuijiang.com/git-commit-written-guide/)

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

## 数据库

### Collection 定义

所有 Collection 定义放在 imports/schema 目录, 每个 Collection 务必定义 Schema 来约束字段

### Schema 定义

Schema 定义使用 [SimpleSchema](https://github.com/aldeed/meteor-simple-schema), 数据插入数据库前必须通过 schema 校验, 调用校验语句为 `表名.schema.validate(要插入的数据);`

### 过滤 Collection 字段

默认情况下, 数据查询语句会返回所有字段, 比如 `Memete.users.find({})` 会将用户的密码和 token 一并返回, 这样是不安全不正确的, find / findOne 的第二个参数是查询选项, `fields` 字段可以控制返回字段, 例如:

```js
Meteor.users.find(
    { },
    {
        fields: {
            username: 1,
            profile: 1,
        },
    },
);
```

该查询会返回 _id, username, profile 字段, 其中 _id 是默认返回的

### 取出populate关联表数据

Message 表的 from 字段关联到了 User 表, 默认情况下查询结果的 from 字段是 user id, 而我们需要的是该 user 的数据. 我们使用 [reywood:publish-composite](https://atmospherejs.com/reywood/publish-composite) 获取关联表数据, 例如取出 message 的 from 字段的数据:

```js
publishComposite('message', {
    find() {
        return Message.find({});
    },
    children: [{
        find(message) {
            message.from = Meteor.users.findOne(
                { _id: message.from },
                {
                    fields: {
                        username: 1,
                        profile: 1,
                    },
                },
            );
        },
    }],
});
```
### 自己定义populate方法
在做邀请新的好友入群的时候,添加新的好友,利用[reywood:publish-composite](https://atmospherejs.com/reywood/publish-composite)并不会自动更新数据,所以以后直接自己在客户端定义方法
这样做的好处是解决了取关联数据不会自动更新的bug,但是有点麻烦的是每次需要关联数据的时候必须在客户端调用一次方法,正在考虑有没有更好的解决方法
```js
import { Meteor } from 'meteor/meteor';

const PopulateUtil = {
    group(group) {
        if (group) {
            group.members = Meteor.users.find({ _id: { $in: group.members } }).fetch();
            group.admin = Meteor.users.findOne({ _id: group.admin });
        }
    },
    groups(groups) {
        groups.forEach(group => PopulateUtil.group(group));
    },
};

export default PopulateUtil;
```
## 前后端通讯

前端出于安全考虑, 已禁止直接操作数据库, 前后端数据交互可通过以下方式

### 需要持续同步的数据

一般为数据库查询操作, 前端随着数据库数据变化自动的响应式更新UI. 实现方法: 后端通过 `Meteor.publish` 添加数据流, 前端需要该数据的地方通过 `Meteor.subscribe` 订阅该数据流, 然后再执行查询语句即可拿到数据

例如:
```js
// 后端
Meteor.publish('message', () => Message.find({}));
// 前端
Meteor.subscribe('message');
const messages = Message.find({ to }).fetch();
```

### 单次数据交互

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
### Add element to array collections.update in meteor
```js
Meteor.users.update(
    Meteor.userId(),
    {
        $push: {
            'profile.friends': friendId,
        },
    },
);
```
### How to delete an array item in meteor using mongo?

```js
Meteor.users.update(
    { _id: Meteor.userId() },
    {
        $pull: {
            'profile.chatList': {
                userId: chatId,
            },
        },

    },
);
```
[mongodb的操作方法](https://docs.mongodb.com/manual/reference/operator/update/pull/)

## SelectMembers组件接收的props及具体含义(多选)

```js
 team: PropTypes.array.isRequired, // 需要选择的人员
 confirmSelected: PropTypes.func.isRequired, // 选择完成后的函数,函数的参数为选中的人员ID
```
具体的参数类型

```js
const friendIds = UserUtil.getFriends();
const team = [
    {
        name: 'e建联好友',
        members: friendIds,
        department: [], // 不存在的时候需要传一个空数组
    },
    {
        name: '知工网络科技有限公司',
        members: ['9A8GrFpDd8TyhCAPs', 'kfFea3wBriB48DPpM', 'Agvq9dmbsXNFtBcwi'],
        department: [
            {
                name: '技术部',
                members: [
                    // 成员
                    'kfFea3wBriB48DPpM',
                ],
            },
            {
                name: '产品部',
                members: [
                    // 成员
                    'Agvq9dmbsXNFtBcwi',
                ],
            },
        ],
    },
];
```
> 可参考在`addChat`组件中发起群聊选择人员的使用

## SelectOne组件接收的props及具体含义(单选)

```js
 teamMemberIds: PropTypes.array.isRequired, // 需要选择的人员
 confirmChange: PropTypes.func.isRequired, // 选择完成后的函数,函数的参数为选中的人员ID
```
> 可参考在`GroupSetting`组件中更换群主的使用