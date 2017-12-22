import { Meteor } from 'meteor/meteor';

import Task from '../../imports/schema/task';
import TaskBoard from '../../imports/schema/taskBoard';


Meteor.methods({
    createTask({ name, taskBoardId, textId, memberId }) {
        const newTask = {
            name,
            taskBoardId,
            memberId,
            describe: '',
            createTime: new Date(),
            beginTime: null,
            endTime: null,
            label: '',
            textId,
            fileId: [],
            taskMembers: [],
        };
        Task.schema.validate(newTask);
        Task.insert(newTask);
    },
    changeTaskMembers(textId, taskMembers) {
        Task.update(
            { textId },
            {
                $set: {
                    taskMembers,
                },
            },
        );
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

