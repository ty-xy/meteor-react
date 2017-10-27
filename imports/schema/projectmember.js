import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const ProjectMember = new Mongo.Collection('projectmember');

ProjectMember.SimpleSchema = new SimpleSchema({
    // 项目id
    projectId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 成员id
    member: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 成员类型 1：项目创建者，2：项目负责人，3：项目参与人
    memberType: {
        type: String,
    },
});


export default ProjectMember;
