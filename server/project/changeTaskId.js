import { Meteor } from 'meteor/meteor';
import Task from '../../imports/schema/task';

Meteor.methods({
    changeTaskId(taskBoardId) {
        Task.update(
            {
                $set: {
                    taskBoardId,
                },
            },
        );
    },
});
