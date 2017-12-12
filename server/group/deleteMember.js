import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';
import Company from '../../imports/schema/company';

Meteor.methods({
    deleteMember(groupId, memberId, companyId) {
        const groups = Group.findOne({ _id: groupId }) || { members: [] };
        const groupmembers = groups.members.length ? groups.members : [];
        // 如果删除群聊只剩一个人且等于要移除的人
        if ((groupmembers.length === 1) && (groupmembers[0] === memberId)) {
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
