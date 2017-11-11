import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const notification = new Mongo.Collection('notification');
notification.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    username: {
        type: String,
    },
    company: {
        type: String,
    },
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    content: {
        type: String,
    },
    isSecrecy: {
        type: Boolean,
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
    group: {
        type: [String],
        optional: true,
    },
    up: {
        type: Boolean,
        optional: true,
    },
});

export default notification;
