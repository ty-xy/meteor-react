import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const checkbill = new Mongo.Collection('checkbill');
checkbill.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    username: {
        type: String,
    },
    approvers: {
        type: [String],
    },
    copy: {
        type: [String],
        optional: true,
    },
    total: {
        type: Number,
    },
    details: {
        type: [Object],
    },
    'details.$.amount': {
        type: Number,
    },
    'details.$.category': {
        type: String,
    },
    'details.$.reason': {
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
});

export default checkbill;
