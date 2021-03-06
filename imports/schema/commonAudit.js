import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const commonAudit = new Mongo.Collection('commonaudit');
commonAudit.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    detail: {
        type: String,
    },
    content: {
        type: String,
    },
    userId: {
        type: String,
    },
    status: {
        type: 'String',
    },
    type: {
        type: String,
    },
    company: {
        type: String,
    },
    approvers: {
        type: [Object],
    },
    'approvers.$.userId': {
        type: String,
    },
    // isAudit: [审核中， 已审核， 已拒绝]
    'approvers.$.isAudit': {
        type: String,
    },
    copy: {
        type: [String],
        optional: true,
    },
    img: {
        type: [String],
        optional: true,
    },
    file: {
        type: [String],
        optional: true,
    },
    comments: {
        type: [Object],
        optional: true,
    },
    'comments.$.content': {
        type: String,
    },
    'comments.$.createdAt': {
        type: Date,
    },
    'comments.$.userId': {
        type: String,
    },
    // isAudit: [审核中， 已审核， 已拒绝]
    'comments.$.isAudit': {
        type: String,
    },
});

export default commonAudit;
