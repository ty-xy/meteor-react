import { Meteor } from 'meteor/meteor';
import assert from '../../imports/util/assert';
import Notice from '../../imports/schema/notice';

Meteor.methods({
    verifyFriend(friendId, noticeContent) {
        console.log(noticeContent);
        assert(friendId !== Meteor.userId(), 400, '不能添加自己为好友');
        assert(Meteor.user().profile.friends.indexOf(friendId) === -1, 400, '该好友已存在');
        const newNotice = {
            createdAt: new Date(),
            from: Meteor.userId(),
            to: friendId,
            noticeContent,
            type: 0,
            dealResult: 0,
        };
        Notice.schema.validate(newNotice);
        const noticeId = Notice.insert(newNotice);
        Meteor.users.update(
            { _id: friendId },
            {
                $push: {
                    'profile.chatList': {
                        type: 'notice',
                        noticeId,
                        time: new Date(),
                    },
                },
            },
        );
    },
    dealFriendNotice(noticeId, index) {
        Notice.update(
            { _id: noticeId },
            {
                $set: {
                    dealResult: index,
                },
            },
        );
    },
    deleteFriendNotice(noticeId) {
        Notice.remove({
            _id: noticeId,
        });
    },
});
