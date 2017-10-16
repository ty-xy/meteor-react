import {
    Meteor,
} from 'meteor/meteor';
import {
    publishComposite,
} from 'meteor/reywood:publish-composite';

import Message from '../imports/schema/message';
import fields from '../imports/util/fields';

publishComposite('message', {
    find() {
        return Message.find({});
    },
    children: [{
        find(message) {
            message.from = Meteor.users.findOne(
                { _id: message.from },
                {
                    fields: fields.user,
                },
            );
        },
    }],
});

Meteor.publish('users', () => Meteor.users.find(
    {},
    {
        fields: fields.user,
    },
));

