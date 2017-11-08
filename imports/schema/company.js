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
    comments: {
        type: [Object],
        optional: true,
    },
    'comments.$.userId': {
        type: String,
    },
    'comments.$.code': {
        type: String,
    },
    'comments.$.entryTime': {
        type: String,
        optional: true,
    },
    'comments.$.location': {
        type: String,
        optional: true,
    },
    'comments.$.comment': {
        type: String,
        optional: true,
    },
    'comments.$.pos': {
        type: String,
    },
    'comments.$.dep': {
        type: String,
    },
});

export default Company;
