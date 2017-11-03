import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Notice = new Mongo.Collection('notices');
Notice.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    from: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    to: {
        type: String,
        regEx: /.+/,
    },
    // 通知类型: 1,用户需要确认(加好友验证)2,用户不需要确认(添加好友,删除好友,加入群,被踢了)
    type: {
        type: String,
        optional: true,
    },
    // 用户处理通知的结果, 比如:0:拒绝加好友;1,同意加好友;
    dealResult: {
        type: Boolean,
        optional: true,
    },
});

export default Notice;
