import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

Meteor.methods({
    changeGroupName({ groupId, name }) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    name,
                },
            },
        );
    },
});
