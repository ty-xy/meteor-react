import { Meteor } from 'meteor/meteor';
import Messages from '../../imports/schema/message';

Meteor.methods({
    readMessage(groupId) {
        console.log(groupId);
        Messages.update(
            { groupId, 'to.userId': Meteor.userId() },
            {
                $set: {
                    'to.$.isRead': true,
                },
            },
            { multi: true },
        );
    },
    readMessages(messageIds, userId) {
        messageIds.map(messageId =>
            Messages.update(
                { _id: messageId },
                {
                    $push: {
                        readedMembers: userId,
                    },
                },
            ),
        );
    },
});
