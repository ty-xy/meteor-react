import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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
    // 忘记密码后重新修改密码
    setUserPassword({ newPassword }) {
        Accounts.setPassword(Meteor.userId(), newPassword, (err) => {
            console.error(err);
        });
    },
    changeUserBaseInfo(name, signature = '', sex = '', age = '', province = '', city = '', area = '') {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    'profile.name': name,
                    'profile.signature': signature,
                    'profile.sex': sex,
                    'profile.age': age,
                    'address.province': province,
                    'address.city': city,
                    'address.area': area,
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
