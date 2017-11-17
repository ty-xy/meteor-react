import {
    Meteor,
} from 'meteor/meteor';
import TaskBoard from '../../imports/schema/taskBoard';
import Task from '../../imports/schema/task';
import File from '../../imports/schema/file';

Meteor.methods({
    deleteaTaskBoardTask(activeId, sortArray, item) {
        Task.remove({
            textId: item,
        });
        TaskBoard.update(
            { _id: activeId },
            {
                $set: {
                    sortArray,
                },
            },
        );
    },
    deleteFile(taskId, Id) {
        const task = Task.find({ _id: taskId }).fetch();
        const file = task[0].fileId;
        const removeIndex = file.indexOf(Id);
        if (removeIndex !== -1) {
            file.splice(removeIndex, 1);
            Task.update(
                { _id: taskId },
                {
                    $set: {
                        fileId: file,
                    },
                },
            );
            File.remove({
                _id: Id,
            });
        }
    },
});
