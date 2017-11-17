import { Meteor } from 'meteor/meteor';
import Messages from '../../imports/schema/message';

Meteor.methods({
    readMessage(messageId, userId) {
        // console.log('已读消息Id', messageId);
        Messages.update(
            { _id: messageId },
            {
                $push: {
                    readedMembers: userId,
                },
            },
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
