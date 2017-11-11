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
    },
    file: {
        type: [String],
    },
    img: {
        type: [String],
    },
    peo: {
        type: [String],
    },
    group: {
        type: [String],
    },
});

export default log;
