import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    insertMessage(content, createAt) {
        return Messages.insert({
            content,
            createAt,
        });
    },
});
