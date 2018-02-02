import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import bcrypt from 'bcrypt';

import qiniu from '../../imports/util/qiniu';
import assert from '../../imports/util/assert';

Meteor.methods({
    changeAvatar(imageBase64, _id) {
        const imgType = imageBase64.substring(imageBase64.indexOf('/') + 1, imageBase64.lastIndexOf(';'));
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        qiniu.uploadBytes(`avatar_${_id}_${Date.now()}.${imgType}`, imageBinary)
            .then(Meteor.bindEnvironment(imageKey => Meteor.users.update(
                Meteor.userId(),
                {
                    $set: {
                        'profile.avatar': imageKey,
                    },
                },
            )));
    },
    // 确定这个手机号，有没有被注册
     makeSureRegister(newUserName) {
        const findResult = Meteor.users.findOne({ username: newUserName });
        // console.log(findResult.services);
        assert(findResult === undefined, 400, '该手机号已被注册');
     },
    // 修改用户名(手机号)
    changeUserName(newUserName) {
        const findResult = Meteor.users.findOne({ username: newUserName });
        assert(findResult === undefined, 400, '该手机号已被注册');
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    username: newUserName,
                },
            },
        );
    },
    // 确定没有这个手机好
    makeSureNumber(username) {
        const result = Meteor.users.findOne({ username });
        if (!result) {
            assert(false, 400, '该手机号尚未注册');
        }
    },
    // 校验密码的正确性
    // validatePassword(newUserName, password) {
    //     const findResult = Meteor.users.findOne({ username: newUserName });

    // },
    // 忘记密码后重新修改密码
    setUserPassword({ newPassword, username }) {
        const user = Meteor.users.findOne({ username });
        console.log(user, username);
        if (user) {
            Accounts.setPassword(user._id, newPassword, (err) => {
                console.error(err);
            });
        } else {
            assert(false, 400, '该手机号尚未注册');
        }
    },
    changeUserBaseInfo({ name, signature = '', sex = '', age = '', address = [] }) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    'profile.name': name,
                    'profile.signature': signature,
                    'profile.sex': sex,
                    'profile.age': age,
                    'profile.address': address,
                },
            },
        );
    },
    changeVerifyFriend(verifyFriend) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    'profile.verifyFriend': verifyFriend,
                },
            },
        );
    },
    changeHideInfo(isHideInfo) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    'profile.isHideInfo': isHideInfo,
                },
            },
        );
    },
});
