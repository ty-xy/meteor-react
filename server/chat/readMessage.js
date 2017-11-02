import { Meteor } from 'meteor/meteor';
import Messages from '../../imports/schema/message';

Meteor.methods({
    readMessage(messageId, userId) {
        Messages.update(
            { _id: messageId },
            {
                $push: {
                    readedMembers: userId,
                },
            },
        );
    },
});
