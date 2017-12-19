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
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
    },
    stickTop: {
        type: [Object],
        optional: true,
    },
    'stickTop.$.userId': {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    'stickTop.$.value': {
        type: Boolean,
    },
    'stickTop.$.createdAt': {
        type: Date,
    },
    type: {
        type: String,
    },
    companyId: {
        type: String,
        optional: true,
    },
    superiorId: {
        type: String,
        optional: true,
    },
});

export default Group;
