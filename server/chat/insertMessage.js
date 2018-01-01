import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage({ content, to, type, chatType, groupId }) {
        const createdAt = new Date();
        const newMessage = {
            content,
            createdAt,
            from: {
                _id: Meteor.userId(),
                name: Meteor.user().profile.name,
                avatar: Meteor.user().profile.avatar,
                avatarColor: Meteor.user().profile.avatarColor,
            },
            to,
            type,
            chatType,
            groupId,
            readedMembers: [Meteor.userId()],
        };
        Messages.schema.validate(newMessage);
        Messages.insert(newMessage);
        // console.log('id', id);
        // return createdAt;
    },
});
