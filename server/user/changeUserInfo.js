import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import qiniu from '../../imports/util/qiniu';

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
    changeUserName(newUserName) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    username: newUserName,
                },
            },
        );
    },
    changeUserPassword(oldPassword, newPassword) {
        // console.log(111, Accounts);
        Accounts.changePassword(oldPassword, newPassword, (err) => {
            console.error(err);
        });
    },
    setUserPassword(newPassword) {
        Accounts.setPassword(Meteor.userId(), newPassword, (err) => {
            console.error(err);
        });
    },
    setSignature(signature) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    signature,
                },
            },
        );
    },
    setSex(sex) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    sex,
                },
            },
        );
    },
    setAge(age) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    age,
                },
            },
        );
    },
    setAddress(province, city, area) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    'address.province': province,
                    'address.city': city,
                    'address.area': area,
                },
            },
        );
    },
});
