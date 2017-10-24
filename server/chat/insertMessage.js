import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage({ content, to, type, fileName }) {
        const newMessage = {
            content,
            createdAt: new Date(),
            from: Meteor.userId(),
            to,
            type,
            fileName,
        };
        Messages.schema.validate(newMessage);
        return Messages.insert(newMessage);
    },
});
