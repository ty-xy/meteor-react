import { Meteor } from 'meteor/meteor';
import TaskList from '../../imports/schema/taskList';


Meteor.methods({
    createTaskList({ name, taskId, textId, fatherId, listId, checkble = 0 }) {
        const newTaskList = {
            name,
            taskId,
            textId,
            fatherId,
            listId,
            checkble,
            createTime: new Date(),
        };
        TaskList.schema.validate(newTaskList);
        TaskList.insert(newTaskList);
    },
    changeTaskList(listId, name) {
        TaskList.update(
            { listId },
            {
                $set: {
                    name,
                },
            },
        );
    },
    changeCheckble(listId, checkble) {
        TaskList.update(
            { listId },
            {
                $set: {
                    checkble,
                },
            },
        );
    },
});
