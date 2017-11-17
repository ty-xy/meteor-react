
/*
任务信息
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Task = new Mongo.Collection('task');
Task.schema = new SimpleSchema({
    // 任务名称
    name: {
        type: String,
    },
    // 任务版id
    taskBoardId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 创建人id
    // content: {
    //     type: String,
    //     regEx: SimpleSchema.RegEx.Id,
    // },
    // 创建时间
    createTime: {
        type: Date,
    },
    // // 标签
    label: {
        type: String,
    },
    // // 开始时间
    beginTime: {
        type: String,
    },
    // 结束时间
    endTime: {
        type: String,
    },
    // 描述
    describe: {
        type: String,
    },
    textId: {
        type: String,
    },
    // 文件的id 
    fileId: {
        type: [String],
    },
});

export default Task;
