import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const ProjectFile = new Mongo.Collection('projectfile');

ProjectFile.schema = new SimpleSchema({
    // 项目id
    projectId: {
        type: String,
    },
    // 文件Id,
    fileId: {
        type: String,
    },
    createTime: {
        type: Date,
    },
});


export default ProjectFile;
