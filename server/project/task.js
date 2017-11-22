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
            beginTime: null,
            endTime: null,
            label: '',
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
    repeatTask(textId, describe, beginTime, endTime, label) {
        Task.update(
            { textId }, {
                $set: {
                    describe,
                    beginTime,
                    endTime,
                    label,
                },
            },
        );
    },
});

