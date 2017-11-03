import { Meteor } from 'meteor/meteor';
import Task from '../../imports/schema/task';

Meteor.methods({
    changeTask(taskId, describe) {
        Task.update(
            { _id: taskId },
            {
                $set: {
                    describe,
                },
            },
        );
    },
});
