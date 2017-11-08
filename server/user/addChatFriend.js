import { Meteor } from 'meteor/meteor';
import assert from '../../imports/util/assert';

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
                        'profile.chatList': {
                            type: 'user',
                            userId: friendId,
                            time: new Date(),
                        },
                    },
                },
            );
            Meteor.users.update(
                friendId,
                {
                    $push: {
                        'profile.friends': Meteor.userId(),
                        'profile.chatList': {
                            type: 'user',
                            userId: Meteor.userId(),
                            time: new Date(),
                        },
                    },
                },
            );
        }
    },
    // 同在一个群里可以发起临时会话
    addTemporaryChat(friendId) {
        assert(friendId !== Meteor.userId(), 400, '不能添加自己为好友');
        assert(Meteor.user().profile.friends.indexOf(friendId) === -1, 400, '该好友已存在');

        Meteor.users.update(
            Meteor.userId(),
            {
                $push: {
                    'profile.chatList': {
                        type: 'user',
                        userId: friendId,
                        time: new Date(),
                    },
                },
            },
        );
        Meteor.users.update(
            friendId,
            {
                $push: {
                    'profile.chatList': {
                        type: 'user',
                        userId: Meteor.userId(),
                        time: new Date(),
                    },
                },
            },
        );
    },
});

