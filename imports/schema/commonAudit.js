import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const commonAudit = new Mongo.Collection('commonaudit');
commonAudit.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    username: {
        type: String,
    },
    detail: {
        type: String,
    },
    content: {
        type: String,
    },
    approvers: {
        type: [String],
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
});

export default commonAudit;
