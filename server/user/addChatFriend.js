import { Meteor } from 'meteor/meteor';
import assert from '../../imports/util/assert';
import Group from '../../imports/schema/group';

Meteor.methods({
    // 添加好友
    addFriend(friendId) {
        assert(friendId !== Meteor.userId(), 400, '不能添加自己为好友');
        assert(Meteor.user().profile.friends.indexOf(friendId) === -1, 400, '该好友已存在');
        // 如果添加好友之前已存在临死会话,此时再次 push profile.chatList,就会重复创建聊天窗口,如何避免?
        const temporaryChat = Meteor.user().profile.chatList.find(item => item.userId && item.userId === friendId);
        if (temporaryChat) {
            // 已经存在临时会话
            Meteor.users.update(
                Meteor.userId(),
                {
                    $push: {
                        'profile.friends': friendId,
                    },
                },
            );
            Meteor.users.update(
                friendId,
                {
                    $push: {
                        'profile.friends': Meteor.userId(),
                    },
                },
            );
        } else {
            // 不存在临时会话
            Meteor.users.update(
                Meteor.userId(),
                {
                    $push: {
                        'profile.friends': friendId,
                        // 'profile.chatList': {
                        //     type: 'user',
                        //     userId: friendId,
                        //     time: new Date(),
                        // },
                    },
                },
            );
            Meteor.users.update(
                friendId,
                {
                    $push: {
                        'profile.friends': Meteor.userId(),
                        // 'profile.chatList': {
                        //     type: 'user',
                        //     userId: Meteor.userId(),
                        //     time: new Date(),
                        // },
                    },
                },
            );
        }
    },
    // 同在一个群里可以发起临时会话
    async addTemporaryChat(friendId) {
        // const temporaryChat = Group.find({});
        const twoGroup = Group.findOne({ members: { $all: [Meteor.userId(), friendId], $size: 2 } }) || {};
        const chatList = Meteor.user().profile.chatList.find(item => item.groupId === twoGroup._id);
        if (twoGroup._id) {
            // 判断左侧列表是否存在
            if (!chatList) {
                await Meteor.users.update(
                    Meteor.userId(),
                    {
                        $addToSet: { 'profile.chatList': {
                            type: 'user',
                            groupId: twoGroup._id,
                            time: new Date(),
                        } },
                    },
                );
            }
            return twoGroup._id;
        }
        const newGroup = {
            createdAt: new Date(),
            notice: '',
            noticeTime: new Date(),
            isDisturb: [],
            stickTop: [],
            name: '',
            members: [friendId, Meteor.userId()],
            type: 'user',
            companyId: '',
            admin: Meteor.userId(),
            superiorId: '',
            avatar: '',
        };
        Group.schema.validate(newGroup);
        const groupId = await Group.insert(newGroup);
        await Meteor.users.update(
            Meteor.userId(),
            {
                $addToSet: { 'profile.chatList': {
                    type: 'user',
                    groupId,
                    time: new Date(),
                } },
            },
        );
        return groupId;
    },
});

