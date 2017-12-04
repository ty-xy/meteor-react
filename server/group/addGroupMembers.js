import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';

Meteor.methods({
    addGroupMembers({ groupId, newMemberIds }) {
        newMemberIds.map(userId =>
            Group.update(
                { _id: groupId },
                {
                    $push: {
                        members: userId,
                    },
                },
            ),
        );
        newMemberIds.map((userId =>
            Meteor.users.update(
                { _id: userId },
                {
                    $push: {
                        'profile.groups': groupId,
                        'profile.chatList': {
                            type: 'group',
                            groupId,
                            time: new Date(),
                        },
                    },
                },
            )
        ));
    },
});
