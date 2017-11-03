import { Meteor } from 'meteor/meteor';
import Task from '../../imports/schema/task';

Meteor.methods({
    changeLabel(taskId, label) {
        Task.update(
            { _id: taskId },
            {
                $set: {
                    label,
                },
            },
        );
    },
});
