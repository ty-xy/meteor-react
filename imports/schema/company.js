import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Company = new Mongo.Collection('company');
Company.schema = new SimpleSchema({
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    avatar: {
        type: String,
        optional: true,
    },
    position: {
        type: [String],
        optional: true,
    },
    department: {
        type: [String],
        optional: true,
    },
    members: {
        type: [Object],
        optional: true,
    },
    'members.$.userId': {
        type: String,
    },
    'members.$.position': {
        type: [String],
    },
    'members.$.department': {
        type: [String],
    },
});

export default Company;
