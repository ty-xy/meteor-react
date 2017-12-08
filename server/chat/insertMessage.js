import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage({ content, to, type }) {
        const newMessage = {
            content,
            createdAt: new Date(),
            from: Meteor.userId(),
            to,
            type,
            readedMembers: [Meteor.userId()],
        };
        Messages.schema.validate(newMessage);
        return Messages.insert(newMessage);
    },
});
