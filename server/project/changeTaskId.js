import { Meteor } from 'meteor/meteor';
import TaskBoard from '../../imports/schema/taskBoard';
import Task from '../../imports//schema/task';

Meteor.methods({
    changeArray(tastBoardId, item, index) {
        const taskArray = TaskBoard.findOne({ _id: tastBoardId }).sortArray;
        taskArray.splice(index, 0, item);
        console.log(taskArray);
        //  const task = Task.findOne({ textId: item }).taskBoardId;
        TaskBoard.update(
            { _id: tastBoardId },
            {
                $set: {
                    sortArray: taskArray,
                },
            },
        );
        Task.update(
            { textId: item },
            {
                $set: {
                    taskBoardId: tastBoardId,
                },
            },
        );
    },
    deleteArray(tastBoardId, item) {
        const taskArray = TaskBoard.findOne({ _id: tastBoardId }).sortArray;
        const index = taskArray.indexOf(item);
        taskArray.splice(index, 1);
        TaskBoard.update(
            { _id: tastBoardId },
            {
                $set: {
                    sortArray: taskArray,
                },
            },
        );
    },
    deleteArray2(tastBoardId, item, indexl) {
        const taskArray = TaskBoard.findOne({ _id: tastBoardId }).sortArray;
        const index = taskArray.indexOf(item);
        if (indexl > index) {
            taskArray.splice(indexl, 0, item);
            taskArray.splice(index, 1);
            TaskBoard.update(
                { _id: tastBoardId },
                {
                    $set: {
                        sortArray: taskArray,
                    },
                },
            );
        } else if (indexl < index) {
            taskArray.splice(indexl, 0, item);
            taskArray.splice(index + 1, 1);
            TaskBoard.update(
                { _id: tastBoardId },
                {
                    $set: {
                        sortArray: taskArray,
                    },
                },
            );
        }
    },
    changeTaskId(tastBoardId, sortArray) {
        TaskBoard.update(
            { _id: tastBoardId },
            {
                $set: {
                    sortArray,
                },
            },
        );
    },
});
