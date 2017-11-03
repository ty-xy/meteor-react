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
    noDepMember: {
        type: [Object],
        optional: true,
    },
    dep: {
        type: [Object],
        optional: true,
    },
    'dep.$.name': {
        type: String,
    },
    'dep.$.admin': {
        type: String,
        optional: true,
    },
    'dep.$.avatar': {
        type: String,
        optional: true,
    },
    'dep.$.comment': {
        type: [Object],
        optional: true,
    },
    'dep.$.comment.$.userId': {
        type: String,
    },
    'dep.$.comment.$.name': {
        type: String,
    },
    'dep.$.comment.$.phone': {
        type: String,
    },
    'dep.$.comment.$.code': {
        type: String,
    },
    'dep.$.comment.$.entryTime': {
        type: String,
        optional: true,
    },
    'dep.$.comment.$.location': {
        type: String,
        optional: true,
    },
    'dep.$.comment.$.comment': {
        type: String,
        optional: true,
    },
    'dep.$.comment.$.birthday': {
        type: String,
        optional: true,
    },
    'dep.$.comment.$.pos': {
        type: [String],
    },
});

export default Company;
