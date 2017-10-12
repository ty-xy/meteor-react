import {
    Meteor,
} from 'meteor/meteor';
import {
    publishComposite,
} from 'meteor/reywood:publish-composite';

import Message from '../imports/schema/message';

Meteor.publish('userData', () => Meteor.user());

publishComposite('message', {
    find() {
        return Message.find({});
    },
    children: [{
        find(message) {
            message.from = Meteor.users.findOne(
                { _id: message.from },
                {
                    fields: {
                        username: 1,
                        profile: 1,
                    },
                },
            );
        },
    }],
});
