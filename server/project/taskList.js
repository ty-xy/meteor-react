import { Meteor } from 'meteor/meteor';
import TaskList from '../../imports/schema/taskList';


Meteor.methods({
    createTaskList({ name, taskId, textId, fatherId, listId }) {
        const newTaskList = {
            name,
            taskId,
            textId,
            fatherId,
            listId,
            createTime: new Date(),
        };
        TaskList.schema.validate(newTaskList);
        TaskList.insert(newTaskList);
    },
    changeTaskList(listId) {
        TaskList.update(
            { listId },
            {
                $set: {
                    name,
                },
            },
        );
    },
});
