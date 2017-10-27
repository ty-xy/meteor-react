import { Meteor } from 'meteor/meteor';

import Project from '../../imports/schema/project';


Meteor.methods({
    createGroup1({ name, intro, affiliation }) {
        const newGroup = {
            name,
            intro,
            affiliation,
            createTime: new Date(),
        };
        Project.schema.validate(newGroup);
        Project.insert(newGroup);
    },
});

