import {
    Meteor,
} from 'meteor/meteor';
import {
    publishComposite,
} from 'meteor/reywood:publish-composite';

import Message from '../imports/schema/message';
import Group from '../imports/schema/group';
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

// publishComposite('group', {
//     find() {
//         return Group.find({});
//     },
//     children: [{
//         find(group) {
//             // group.members111 = group.members;
//             group.members111 = Meteor.users.find(
//                 { _id: { $in: group.members } },
//                 {
//                     fields: fields.user,
//                 },
//             ).fetch();
//         },
//     }, {
//         find(group) {
//             group.admin = Meteor.users.findOne(
//                 { _id: group.admin },
//                 {
//                     fields: fields.user,
//                 },
//             );
//         },
//     }],
// });
Meteor.publish('group', () => Group.find({}));

