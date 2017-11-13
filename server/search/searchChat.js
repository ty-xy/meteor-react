import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';
import Group from '../../imports/schema/group';

import UserUtil from '../../imports/util/user';
import IdUtil from '../../imports/util/id';

Meteor.methods({
    searchChat(pattern) {
        console.log(1111);
        // 该用户的好友,群组,聊天记录
        const selfGroup = UserUtil.getGroups();
        const selfFriend = UserUtil.getFriends();
        const friendMessage = selfFriend.map(i => IdUtil.merge(Meteor.userId(), i));
        const chatMessageId = [...selfGroup, ...friendMessage];
        const message = Messages.find({ content: { $regex: `/${pattern}/` }, to: { $in: chatMessageId } }).fetch();
        const friends = Meteor.users.find({ 'profile.name': { $regex: `/${pattern}/` }, to: { $in: selfFriend } });
        const groups = Group.find({ name: { $regex: `/${pattern}/` }, to: { $in: selfGroup } });
        return {
            message,
            friends,
            groups,
        };
    },
});
