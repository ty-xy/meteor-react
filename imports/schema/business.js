import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const leave = new Mongo.Collection('business');
leave.schema = new SimpleSchema({
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
});

export default leave;
