import { Meteor } from 'meteor/meteor';
import assert from '../../imports/util/assert';

Meteor.methods({
    searchFriend(username) {
        const findResult = Meteor.users.findOne({ username });
        assert(findResult !== undefined, 400, '搜索不到该用户');
        assert(findResult._id !== Meteor.userId(), 400, '不能添加自己为好友');
        const { profile = {} } = Meteor.user() || {};
        assert(profile.friends.indexOf(findResult._id) === -1, 400, '该用户已经是您的好友了');
        return findResult;
    },
    searchFriends(username) {
        const findResult = Meteor.users.findOne({ username });
        // assert(findResult !== undefined, 400, '搜索不到该用户');
        // assert(findResult._id !== Meteor.userId(), 400, '不能添加自己为好友');
        // const { profile = {} } = Meteor.user() || {};
        // assert(profile.friends.indexOf(findResult._id) === -1, 400, '该用户已经是您的好友了');
        return findResult;
    },
});
