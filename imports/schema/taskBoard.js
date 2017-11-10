/*
任务版信息
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const TaskBoard = new Mongo.Collection('taskboard');
TaskBoard.schema = new SimpleSchema({
    // 任务版名称
    name: {
        type: String,
    },
    // 项目id
    projectId: {
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
    sortArray: {
        type: [String],
    },
});

export default TaskBoard;
