import { Meteor } from 'meteor/meteor';
import Messages from '../../imports/schema/message';

Meteor.methods({
    readMessage(groupId) {
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
    readMessageLast(groupId) {
        Messages.findAndModify(
            {
                query: { groupId, 'to.userId': Meteor.userId() },
                sort: { $natural: -1 },
                update: {
                    $set: {
                        'to.$.isRead': true,
                    },
                },
            },
        );
    },
});
