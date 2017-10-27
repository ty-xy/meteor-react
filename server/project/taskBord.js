import { Meteor } from 'meteor/meteor';

import TaskBoard from '../../imports/schema/taskBoard';


Meteor.methods({
    createTaskBoard({ name, projectId }) {
        const newTaskBoard = {
            name,
            projectId,
            createTime: new Date(),
        };
        TaskBoard.schema.validate(newTaskBoard);
        TaskBoard.insert(newTaskBoard);
    },
});
