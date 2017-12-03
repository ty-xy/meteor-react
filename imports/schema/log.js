import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const log = new Mongo.Collection('log');
log.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    userId: {
        type: String,
    },
    nickname: {
        type: String,
    },
    company: {
        type: String,
    },
    type: {
        type: String,
    },
    finish: {
        type: String,
        optional: true,
    },
    plan: {
        type: String,
        optional: true,
    },
    help: {
        type: String,
        optional: true,
    },
    file: {
        type: [String],
        optional: true,
    },
    img: {
        type: [String],
        optional: true,
    },
    peo: {
        type: [Object],
        optional: true,
    },
    'peo.$.userId': {
        type: String,
    },
    'peo.$.isRead': {
        type: Boolean,
        optional: true,
    },
    'peo.$.rejectLook': {
        type: Boolean,
        optional: true,
    },
    group: {
        type: [String],
        optional: true,
    },
    cache: {
        type: Boolean,
        optional: true,
    },
});

export default log;
