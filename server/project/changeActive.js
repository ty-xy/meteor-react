import {
    Meteor,
} from 'meteor/meteor';
import Active from '../../imports/schema/active';

Meteor.methods({
    changeActive(ActiveId, content) {
        Active.update(
            { _id: ActiveId },
            {
                $set: {
                    content,
                },
            },
        );
    },
});
