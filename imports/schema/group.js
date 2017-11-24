import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Group = new Mongo.Collection('group');
Group.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    members: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
    },
    admin: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    notice: {
        type: String,
    },
    noticeTime: {
        type: Date,
    },
    isDisturb: {
        type: Boolean,
    },
    stickTop: {
        type: Object,
    },
    'stickTop.value': {
        type: Boolean,
    },
    'stickTop.createdAt': {
        type: Date,
    },
    type: {
        type: String,
    },
    superiorId: {
        type: String,
    },
});

export default Group;
