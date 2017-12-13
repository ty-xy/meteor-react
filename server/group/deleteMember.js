import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

Meteor.methods({
    deleteMember(groupId, memberId) {
        console.log('deleteMember', groupId, memberId);
        const groups = Group.findOne({ _id: groupId }) || {};
        if (groups.admin === memberId) {
            const members = groups.members.filter(item => (item !== memberId));
            const admin = members[Math.ceil(Math.random() * members.length)];
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
