
/*
 任务清单
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const TaskList = new Mongo.Collection('tasklist');
TaskList.schema = new SimpleSchema({
    // 清单名称
    name: {
        type: String,
    },
    // 任务id
    // 父清单id
    fatherId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 创建人id
    content: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 创建时间
    createTime: {
        type: Date,
    },
    // 是否完成

});

export default TaskList;
