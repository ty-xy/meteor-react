import {
    Meteor,
} from 'meteor/meteor';
import TaskBoard from '../../imports/schema/taskBoard';
import Task from '../../imports/schema/task';

Meteor.methods({
    deleteaTaskBoardTask(activeId) {
        const tasks = TaskBoard.findOne({ _id: activeId });
        tasks.sortArray.map(item => Task.remove({
            textId: item,
        }));
    },
    deleteaTaskBoard(activeId) {
        TaskBoard.remove({
            _id: activeId,
        });
    },
});
