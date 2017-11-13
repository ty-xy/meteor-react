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
    },
    plan: {
        type: String,
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
        type: [String],
        optional: true,
    },
    group: {
        type: [String],
        optional: true,
    },
});

export default log;
