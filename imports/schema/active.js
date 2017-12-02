
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Active = new Mongo.Collection('active');
Active.schema = new SimpleSchema({
    // 评论人id
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 评论内容
    content: {
        type: String,
    },
    // 任务id
    taskId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 评论时间
    createTime: {
        type: Date,
    },
});

export default Active;
