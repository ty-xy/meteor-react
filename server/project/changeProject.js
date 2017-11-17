import {
    Meteor,
} from 'meteor/meteor';
import Project from '../../imports/schema/project';

Meteor.methods({
    changeProject(projectId, name, intro, affiliation, headPortrait) {
        Project.update(
            { _id: projectId },
            {
                $set: {
                    name,
                    intro,
                    affiliation,
                    headPortrait,
                },
            },
        );
    },
});
