import { Meteor } from 'meteor/meteor';
import ProjectFile from '../../imports/schema/projectfile';
import File from '../../imports/schema/file';

Meteor.methods({
    createProjectFile({ projectId, fileId }) {
        const newProjectFile = {
            projectId,
            fileId,
            createTime: new Date(),
        };
        ProjectFile.schema.validate(newProjectFile);
        ProjectFile.insert(newProjectFile);
    },
    deleteProjectFile(id) {
        ProjectFile.remove({ fileId: id });
        File.remove({ _id: id });
    },
})
;
