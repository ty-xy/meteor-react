import {
    Meteor,
} from 'meteor/meteor';
import Project from '../../imports/schema/project';

Meteor.methods({
    deleteProject(ProjectId) {
        Project.remove({
            _id: ProjectId,
        });
    },
});
