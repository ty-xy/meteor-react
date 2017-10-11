import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage({ content, createdAt, to }) {
        const newMessage = {
            content,
            createdAt,
            from: Meteor.userId(),
            to,
        };
        Messages.schema.validate(newMessage);
        return Messages.insert(newMessage);
    },
});
