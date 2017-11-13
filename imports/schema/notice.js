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
    noticeContent: {
        type: String,
    },
    // 通知类型: 0,用户需要确认(加好友验证)1,用户不需要确认(添加好友,删除好友,加入群,被踢了)
    type: {
        type: Number,
        optional: true,
    },
    // 用户处理通知的结果, 比如:0: 未处理;1:拒绝加好友;2,同意加好友;3, 直接删除
    dealResult: {
        type: Number,
        optional: true,
    },
});

export default Notice;
