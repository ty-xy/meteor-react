import {
    Meteor,
} from 'meteor/meteor';
import Project from '../../imports/schema/project';
import TaskBoard from '../../imports/schema/taskBoard';
import Task from '../../imports/schema/task';
import TaskList from '../../imports/schema/taskList';
import Active from '../../imports/schema/active';

Meteor.methods({
    deleteProject(ProjectId) {
        const taskBoard = TaskBoard.find({ projectId: ProjectId }).fetch();
        taskBoard.forEach((value) => {
            const sortArray = value.sortArray;
            if (sortArray.length > 0) {
                const task = Task.find({ textId: { $in: sortArray } });
                task.forEach((item) => {
                    TaskList.remove({
                        textId: item.textId,
                    });
                    Active.remove({
                        taskId: item._id,
                    });
                });
                Task.remove({
                    textId: { $in: sortArray },
                });
            }
        });
        TaskBoard.remove({
            projectId: ProjectId,
        });
        Project.remove({
            _id: ProjectId,
        });
    },
});
