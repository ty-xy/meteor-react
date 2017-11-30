import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';

Meteor.methods({
    addGroupMembers({ groupId, newMembers }) {
        newMembers.map(user =>
            Group.update(
                { _id: groupId },
                {
                    $push: {
                        members: user,
                    },
                },
            ),
        );
        newMembers.map((user =>
            Meteor.users.update(
                { _id: user },
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
