import { Meteor } from 'meteor/meteor';
import Task from '../../imports/schema/task';

Meteor.methods({
    changeName(taskId, name) {
        Task.update(
            { _id: taskId },
            {
                $set: {
                    name,
                },
            },
        );
    },
});
