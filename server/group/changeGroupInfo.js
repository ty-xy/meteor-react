import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    // 修改群主
    changeAdmin(groupId, admin) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    admin,
                },
            },
        );
    },
    // 修改群昵称
    changeGroupName(groupId, name) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    name,
                },
            },
        );
    },
    changeGroupAvatar(imageBase64, groupId) {
        const imgType = imageBase64.substring(imageBase64.indexOf('/') + 1, imageBase64.lastIndexOf(';'));
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        qiniu.uploadBytes(`avatar_${groupId}_${Date.now()}.${imgType}`, imageBinary)
            .then(Meteor.bindEnvironment(imageKey => Group.update(
                { _id: groupId },
                {
                    $set: {
                        avatar: imageKey,
                    },
                },
            )));
    },
    // 消息免打扰
    changeGroupDisturb(groupId, isDisturb) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    isDisturb,
                },
            },
        );
    },
    // 群聊置顶
    changeGroupStickTop(groupId, stickTop) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    'stickTop.value': stickTop,
                    'stickTop.createdAt': new Date(),
                },
            },
        );
    },
});
