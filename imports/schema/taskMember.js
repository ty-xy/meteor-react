/*
任务成员
 */

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const TaskMember = new Mongo.Collection('taskmember');
TaskMember.schema = new SimpleSchema({
    // 成员id
    memberId: {
        type: String,
    },
    // 任务id
    taskId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 创建时间
    createTime: {
        type: Date,
    },
});

export default TaskMember;
