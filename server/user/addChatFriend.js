import { Meteor } from 'meteor/meteor';
import assert from '../../imports/util/assert';

Meteor.methods({
    addFriend(friendId) {
        assert(friendId !== Meteor.userId(), 400, '不能添加自己为好友');
        assert(Meteor.user().profile.friends.indexOf(friendId) === -1, 400, '该好友已存在');

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
    },
});

