import { Meteor } from 'meteor/meteor';
import Task from '../../imports/schema/task';

Meteor.methods({
    changeEndTime(taskId, endTime) {
        Task.update(
            { _id: taskId },
            {
                $set: {
                    endTime,
                },
            },
        );
    },
});
