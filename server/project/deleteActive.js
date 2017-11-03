import {
    Meteor,
} from 'meteor/meteor';
import Active from '../../imports/schema/active';

Meteor.methods({
    deleteActive(activeId) {
        Active.remove({
            _id: activeId,
        });
    },
});
