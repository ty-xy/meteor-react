import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage({ content, to, type, chatType, groupId }) {
        const newMessage = {
            content,
            createdAt: new Date(),
            from: Meteor.userId(),
            to,
            type,
            chatType,
            groupId,
            readedMembers: [Meteor.userId()],
        };
        Messages.schema.validate(newMessage);
        Messages.insert(newMessage);
        // console.log('id', id);
        // return id;
    },
});
