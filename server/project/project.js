import { Meteor } from 'meteor/meteor';

import Project from '../../imports/schema/project';


Meteor.methods({
    createGroup1({ name, intro, affiliation, headPortrait }) {
        const newGroup = {
            name,
            intro,
            affiliation,
            headPortrait,
            createTime: new Date(),
            pigeonhole: 1,
            creater: Meteor.userId(),
        };
        Project.schema.validate(newGroup);
        Project.insert(newGroup);
    },
});

