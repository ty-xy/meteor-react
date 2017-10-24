import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

Meteor.methods({
    changeAdmin(groupId, admin) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    admin,
                },
            },
        );
    },
});
