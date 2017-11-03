import { Meteor } from 'meteor/meteor';
import Task from '../../imports/schema/task';

Meteor.methods({
    changeTime(taskId, beginTime) {
        Task.update(
            { _id: taskId },
            {
                $set: {
                    beginTime,
                },
            },
        );
    },
});
