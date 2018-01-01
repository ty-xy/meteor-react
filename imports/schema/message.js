import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Message = new Mongo.Collection('messages');
Message.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    from: {
        type: Object,
    },
    'from.name': {
        type: String,
    },
    'from._id': {
        type: String,
        optional: true,
    },
    'from.avatar': {
        type: String,
    },
    'from.avatarColor': {
        type: String,
    },
    to: {
        type: [Object],
    },
    'to.$.userId': {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    'to.$.isRead': {
        type: Boolean,
        optional: true,
    },
    content: {
        type: String,
    },
    // 聊天的类型
    type: {
        type: String,
        optional: true,
    },
    // 个人还是群组
    chatType: {
        type: String,
        optional: true,
    },
    readedMembers: {
        type: [String],
    },
    groupId: {
        type: String,
    },
});

export default Message;
