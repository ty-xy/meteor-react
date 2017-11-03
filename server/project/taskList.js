import { Meteor } from 'meteor/meteor';
import TaskList from '../../imports/schema/taskList';


Meteor.methods({
    createTaskList({ name, taskId, fatherId }) {
        const newTaskList = {
            name,
            taskId,
            fatherId,
            createTime: new Date(),
        };
        TaskList.schema.validate(newTaskList);
        TaskList.insert(newTaskList);
    },
});
