import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';

Meteor.methods({
    createGroup({ name, members }) {
        const newGroup = {
            createdAt: new Date(),
            name,
            avatar: '',
            members,
            admin: Meteor.userId(),
            notice: '',
        };
        Group.schema.validate(newGroup);
        const groupId = Group.insert(newGroup);
        members.map((user =>
            Meteor.users.update(
                { _id: user },
                {
                    $push: {
                        'profile.groups': groupId,
                        'profile.chatList': {
                            type: 'group',
                            groupId,
                        },
                    },
                },
            )
        ));
    },
});
