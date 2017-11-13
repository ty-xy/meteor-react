import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Company = new Mongo.Collection('company');
Company.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    name: {
        type: String,
    },
    admin: {
        type: String,
        optional: true,
    },
    logo: {
        type: String,
        optional: true,
    },
    comment: {
        type: String,
        optional: true,
    },
    url: {
        type: String,
        optional: true,
    },
    deps: {
        type: [Object],
        optional: true,
    },
    'deps.$.name': {
        type: String,
    },
    'deps.$.admin': {
        type: String,
        optional: true,
    },
    'deps.$.avatar': {
        type: String,
        optional: true,
    },
    'deps.$.comment': {
        type: String,
        optional: true,
    },
    members: {
        type: [Object],
        optional: true,
    },
    'members.$.userId': {
        type: String,
    },
    'members.$.code': {
        type: String,
    },
    'members.$.entryTime': {
        type: String,
        optional: true,
    },
    'members.$.location': {
        type: String,
        optional: true,
    },
    'members.$.comment': {
        type: String,
        optional: true,
    },
    'members.$.pos': {
        type: String,
    },
    'members.$.dep': {
        type: String,
    },
});

export default Company;
