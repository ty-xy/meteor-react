import {
    Meteor,
} from 'meteor/meteor';
import Project from '../../imports/schema/project';

Meteor.methods({
    changePig(projectId, pigeonhole) {
        Project.update(
            { _id: projectId },
            {
                $set: {
                    pigeonhole,
                    createTime: new Date(),
                },
            },
        );
    },
});
