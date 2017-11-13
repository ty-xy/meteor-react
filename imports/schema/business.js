import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const leave = new Mongo.Collection('business');
leave.schema = new SimpleSchema({
    createdAt: {
        type: Date,
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
    daynum: {
        type: Number,
    },
    details: {
        type: [Object],
    },
    'details.$.endAt': {
        type: String,
    },
    'details.$.startAt': {
        type: String,
    },
    'details.$.location': {
        type: String,
    },
    img: {
        type: [String],
        optional: true,
    },
    file: {
        type: [String],
        optional: true,
    },
    reason: {
        type: String,
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

export default leave;
