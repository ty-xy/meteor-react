import { Meteor } from 'meteor/meteor';
import Active from '../../imports/schema/active';

Meteor.methods({
    createActive({ userId, content, taskId }) {
        const newActive = {
            userId,
            content,
            taskId,
            createTime: new Date(),
        };
        Active.schema.validate(newActive);
        Active.insert(newActive);
    },
});


Meteor.publish('active', () => Active.find({}));
