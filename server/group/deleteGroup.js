import {
    Meteor,
} from 'meteor/meteor';
import Group from '../../imports/schema/group';
import Messages from '../../imports/schema/message';

Meteor.methods({
    deleteGroup(groupId) {
        const groupMembers = Group.findOne({
            _id: groupId,
        });
        groupMembers.members.map(user => (
            Meteor.users.update({
                _id: user,
            }, {
                $pull: {
                    'profile.groups': groupId,
                    'profile.chatList': {
                        groupId,
                    },
                },

            })
        ));
        Group.remove({
            _id: groupId,
        });
        Messages.remove({
            to: groupId,
        });
    },
});
