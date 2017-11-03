import { Meteor } from 'meteor/meteor';
import Active from '../../imports/schema/active';

Meteor.methods({
    createActive({ content, taskId }) {
        const newActive = {
            content,
            taskId,
            createTime: new Date(),
        };
        Active.schema.validate(newActive);
        Active.insert(newActive);
    },
});


Meteor.publish('active', () => Active.find({}));
