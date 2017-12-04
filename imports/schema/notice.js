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
    // 发送人所在团队
    userCompany: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
    },
    // 发送的类型
    noticeType: {
        type: String,
        optional: true,
    },
    // 发送日志等的通知对象
    toMembers: {
        type: [Object],
        optional: true,
    },
    'toMembers.$.userId': {
        type: String,
    },
    'toMembers.$.isRead': {
        type: Boolean,
        optional: true,
    },
    'toMembers.$.rejectRead': {
        type: Boolean,
        optional: true,
    },
    to: {
        type: String,
        regEx: /.+/,
        optional: true,
    },
    noticeContent: {
        type: String,
        optional: true,
    },
    // 通知类型: 0,用户需要确认(加好友验证)1,用户不需要确认(添加好友,删除好友,加入群,被踢了)
    // verifyFriend: 加好友验证; workNotice: 工作通知; projectNotice: 项目通知
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
