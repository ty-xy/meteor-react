import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

Meteor.methods({
    deleteMember(groupId, memberId) {
        console.log('deleteMember', groupId, memberId);
        Group.update(
            { _id: groupId },
            {
                $pull: {
                    members: memberId,
                },
            },
        );
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
