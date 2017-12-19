import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';
import UserUtil from '../../imports/util/user';
import fields from '../../imports/util/fields';

Meteor.methods({
    searchChat(pattern) {
        // 该用户的好友,群组,聊天记录
        const selfGroup = UserUtil.getGroups();
        const selfFriend = UserUtil.getFriends();
        const friends = Meteor.users.find(
            { 'profile.name': { $regex: `${pattern}` }, _id: { $in: selfFriend } },
            { fields: fields.searchUser },
        ).fetch();
        const groups = Group.find(
            { name: { $regex: `${pattern}` }, _id: { $in: selfGroup } },
            { fields: fields.searchGroup },
        ).fetch();
        const searchResult = {
            friends,
            groups,
        };
        return searchResult;
    },
});
