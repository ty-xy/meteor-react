import { Meteor } from 'meteor/meteor';

import ProjectMember from '../../imports/schema/projectmember';


Meteor.methods({
    createProjectmember({ projectId, member, memberType }) {
        const newProjectmember = {
            projectId,
            member,
            memberType,
            createTime: new Date(),

        };
        ProjectMember.schema.validate(newProjectmember);
        ProjectMember.insert(newProjectmember);
    },
});
