import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage(content, createdAt) {
        const newMessage = {
            content,
            createdAt,
            from: Meteor.userId(),
        };
        Messages.schema.validate(newMessage);
        return Messages.insert(newMessage);
    },
});
