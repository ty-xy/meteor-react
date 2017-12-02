import { Meteor } from 'meteor/meteor';

import Project from '../../imports/schema/project';


Meteor.methods({
    createGroup1({ name, intro = '', affiliation = '1', headPortrait, creater, members = [], uprojectId }) {
        const newGroup = {
            name,
            intro,
            affiliation,
            headPortrait,
            createTime: new Date(),
            pigeonhole: 1,
            formBoard: '不使用',
            creater,
            members,
            uprojectId,
        };
        Project.schema.validate(newGroup);
        Project.insert(newGroup);
    },
});

