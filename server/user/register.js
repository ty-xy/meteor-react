import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import RegexpUtil from '../../imports/util/regexp';
import assert from '../../imports/util/assert';

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
                friends: [],
                groups: [],
                chatList: [],
                company: [], // 用户所在的公司
                createdCompany: [], // 用户创建的公司
                mainCompany: '', // 管理选择的当前公司
                currentBackendCompany: '', // 进后台选择的当前公司
                verifyFriend: '0', // '0': 需要好友认证;'1': 允许任何人; '2': 不允许任何人
                isHideInfo: false, // 默认隐藏个人信息
            },
        });
    },
});
