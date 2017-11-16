import { Meteor } from 'meteor/meteor';

import Task from '../../imports/schema/task';
import TaskBoard from '../../imports/schema/taskBoard';


Meteor.methods({
    createTask({ name, taskBoardId, textId }) {
        const newTask = {
            name,
            taskBoardId,
            describe: '',
            createTime: new Date(),
            beginTime: '',
            endTime: '',
            label: '#7ED321',
            textId,
            fileId: [],
        };
        Task.schema.validate(newTask);
        Task.insert(newTask);
    },
    changeSortAarry(id, taskId) {
        TaskBoard.update(
            { _id: id },
            {
                $push: {
                    sortArray: taskId,
                },
            },
        );
    },
});

