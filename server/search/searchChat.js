import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';
import Group from '../../imports/schema/group';

import UserUtil from '../../imports/util/user';
import IdUtil from '../../imports/util/id';
import fields from '../../imports/util/fields';

Meteor.methods({
    searchChat(pattern) {
        // 该用户的好友,群组,聊天记录
        const selfGroup = UserUtil.getGroups();
        const selfFriend = UserUtil.getFriends();
        const friendMessage = selfFriend.map(i => IdUtil.merge(Meteor.userId(), i));
        const chatMessageId = [...selfGroup, ...friendMessage];
        const message = Messages.find(
            { content: { $regex: `${pattern}` }, to: { $in: chatMessageId }, type: 'text' },
            { fields: fields.searchMessage },
        ).fetch();
        const friends = Meteor.users.find(
            { 'profile.name': { $regex: `${pattern}` }, _id: { $in: selfFriend } },
            { fields: fields.searchUser },
        ).fetch();
        const groups = Group.find(
            { name: { $regex: `${pattern}` }, _id: { $in: selfGroup } },
            { fields: fields.searchGroup },
        ).fetch();
        const searchResult = {
            message,
            friends,
            groups,
        };
        // console.log(searchResult);
        return searchResult;
    },
});
