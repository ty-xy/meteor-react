import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';
import Company from '../../imports/schema/company';

Meteor.methods({
    deleteMember(groupId, memberId, companyId) {
        const groups = Group.findOne({ _id: groupId }) || {};
        if ((groups.members && groups.members.length) === 1) {
            // 当删除的人员后群聊没有人员， 则删除群聊
            Group.remove({ _id: groupId }, (err, res) => {
                if (res) {
                    // 部门群聊删除后， 对应的部门清空groupId
                    Company.update(
                        { _id: companyId, 'deps.groupId': groupId },
                        { $set: { 'deps.$.groupId': '' } },
                    );
                }
            });
        } else if (groups.admin === memberId) {
            // 当删除的是群主， 删除之后生成新的群主
            const members = groups.members.filter(item => (item !== memberId));
            const admin = members[Math.floor(Math.random() * members.length)];
            Group.update(
                { _id: groupId },
                {
                    $pull: {
                        members: memberId,
                    },
                    $set: { admin },
                },
            );
        } else {
            Group.update(
                { _id: groupId },
                {
                    $pull: {
                        members: memberId,
                    },
                },
            );
        }
        Meteor.users.update(
            { _id: memberId },
            {
                $pull: {
                    'profile.groups': groupId,
                    'profile.chatList': {
                        groupId,
                    },
                },

            },
        );
    },
});
