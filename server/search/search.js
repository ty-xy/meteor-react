import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';
import Task from '../../imports/schema/task';
import UserUtil from '../../imports/util/user';
import fields from '../../imports/util/fields';

Meteor.methods({
    search(pattern) {
        // 该用户的好友,群组,任务
        const selfGroup = UserUtil.getGroups();
        const selfFriend = UserUtil.getFriends();
        const friends = Meteor.users.find(
            { 'profile.name': { $regex: `${pattern}` }, _id: { $in: selfFriend } },
            { fields: fields.searchAllUser },
        ).fetch();
        const groups = Group.find(
            { name: { $regex: `${pattern}` }, _id: { $in: selfGroup } },
            { fields: fields.searchAllGroup },
        ).fetch();
        const tasks = Task.find(
            { name: { $regex: `${pattern}` }, members: { $elemMatch: Meteor.userId() } },
            { fields: fields.searchAllFile },
        ).fetch();
        const searchResult = {
            friends,
            groups,
            tasks,
        };
        // console.log(searchResult);
        return searchResult;
    },
});
