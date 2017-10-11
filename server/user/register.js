import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import RegexpUtil from '../../imports/util/regexp';
import assert from '../../imports/util/assert';

Meteor.methods({
    register(username, password, name, avatarColor) {
        assert(RegexpUtil.phoneNumber.test(username), 400, '无效的手机号码');
        assert(password.length > 0, 400, '密码不能为空');
        assert(name.length > 0, 400, '姓名不能为空');

        return Accounts.createUser({
            username,
            password,
            profile: {
                name,
                avatarColor,
            },
        });
    },
});