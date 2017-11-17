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
    changeFileId(taskId, fileId) {
        Task.update(
            { _id: taskId },
            {
                $push: {
                    fileId,
                },
            },
        );
    },
    changeFileIdW(taskId, fileId) {
        Task.update(
            { _id: taskId },
            {
                $set: {
                    fileId,
                },
            },
        );
    },
});
