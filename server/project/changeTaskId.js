import { Meteor } from 'meteor/meteor';
import TaskBoard from '../../imports/schema/taskBoard';

Meteor.methods({
    changeTaskId(taskBoardId, sortArray) {
        TaskBoard.update(
            { _id: taskBoardId },
            {
                $set: {
                    sortArray,
                },
            },
        );
    },
});
