import { Meteor } from 'meteor/meteor';

import Task from '../../imports/schema/task';


Meteor.methods({
    createTask({ name, taskBoardId }) {
        const newTask = {
            name,
            taskBoardId,
            describe: '',
            createTime: new Date(),
            beginTime: '',
            endTime: '',
            label: '#7ED321',
        };
        Task.schema.validate(newTask);
        Task.insert(newTask);
    },
});


Meteor.publish('task', () => Task.find({}));
