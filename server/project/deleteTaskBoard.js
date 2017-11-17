import {
    Meteor,
} from 'meteor/meteor';
import TaskBoard from '../../imports/schema/taskBoard';

Meteor.methods({
    changeTaskBoard(taskBoardId, name) {
        TaskBoard.update(
            { _id: taskBoardId },
            {
                $set: {
                    name,
                },
            },
        );
    },
    deleteaTaskBoard(activeId) {
        TaskBoard.remove({
            _id: activeId,
        });
    },
});
