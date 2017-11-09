import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';

Meteor.methods({
    createGroup({ name, members }) {
        const newGroup = {
            createdAt: new Date(),
            name,
            avatar: 'http://oxldjnom8.bkt.clouddn.com/groupAvatar.png',
            members,
            admin: Meteor.userId(),
            notice: '',
            noticeTime: new Date(),
            isDisturb: false,
            stickTop: {
                value: false,
                createdAt: new Date(),
            },
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
                            time: new Date(),
                        },
                    },
                },
            )
        ));
        return groupId;
    },
});
