import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

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
    changeGroupName({ groupId, name }) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    name,
                },
            },
        );
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
