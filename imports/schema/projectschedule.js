import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const ProjectSchedule = new Mongo.Collection('projectschedule');

ProjectSchedule.SimpleSchema = new SimpleSchema({
    // 日程标题
    name: {
        type: String,
    },
    // 日程描述
    intro: {
        type: String,
    },
    // 起始时间
    beginTime: {
        type: Date,
    },
    // 结束时间
    endTime: {
        type: Date,
    },
    // 紧急程度 1：普通，2：紧急
    emergencyDegree: {
        type: String,
    },
    // 创建时间
    creationTime: {
        type: Date,
    },
});


export default ProjectSchedule;
