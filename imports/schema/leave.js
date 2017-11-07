import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const leave = new Mongo.Collection('leave');
leave.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    status: {
        type: 'String',
    },
    userId: {
        type: String,
    },
    approvers: {
        type: [String],
    },
    copy: {
        type: [String],
        optional: true,
    },
    daynum: {
        type: Number,
    },
    endAt: {
        type: String,
    },
    startAt: {
        type: String,
    },
    img: {
        type: [String],
        optional: true,
    },
    reason: {
        type: String,
    },
    type: {
        type: String,
    },
    comments: {
        type: [Object],
        optional: true,
    },
    'comments.$.name': {
        type: String,
    },
    'comments.$.centent': {
        type: String,
    },
    'comments.$.createAt': {
        type: String,
    },
});

export default leave;
