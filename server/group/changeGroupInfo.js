import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    // 修改群主
    changeAdmin(groupId, newAdminId) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    admin: newAdminId,
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
    // 设置消息免打扰
    setGroupDisturb(groupId) {
        Group.update(
            { _id: groupId },
            {
                $push: {
                    isDisturb: Meteor.userId(),
                },
            },
        );
    },
    // 取消消息免打扰
    cancelGroupDisturb(groupId) {
        Group.update(
            { _id: groupId },
            {
                $pull: {
                    isDisturb: Meteor.userId(),
                },
            },
        );
    },
    // 设置群聊置顶
    setGroupStickTop(groupId) {
        Group.update(
            { _id: groupId },
            {
                $push: {
                    stickTop: {
                        userId: Meteor.userId(),
                        createdAt: new Date(),
                    },
                },
            },
        );
    },
    // 删除群聊置顶
    cancelGroupStickTop(groupId) {
        Group.update(
            { _id: groupId },
            {
                $pull: {
                    stickTop: {
                        userId: Meteor.userId(),
                    },
                },
            },
        );
    },
});
