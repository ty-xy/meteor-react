import {
    Meteor,
} from 'meteor/meteor';
import TaskList from '../../imports/schema/taskList';

Meteor.methods({
    removeTaskList(taskListId) {
        TaskList.remove({
            fatherId: taskListId,
        });
        TaskList.remove({
            listId: taskListId,
        });
    },
});
