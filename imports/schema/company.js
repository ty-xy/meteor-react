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
    // 团队logo
    logo: {
        type: String,
        optional: true,
    },
    // 行业类型
    industryType: {
        type: String,
        optional: true,
    },
    // 所在地区
    residence: {
        type: [String],
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
    'deps.$.isAutoChat': {
        type: Boolean,
        optional: true,
    },
    // 团队成员
    members: {
        type: [Object],
        optional: true,
    },
    'members.$.userId': {
        type: String,
    },
    'members.$.username': {
        type: String,
    },
    'members.$.code': {
        type: String,
        optional: true,
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
        optional: true,
    },
    'members.$.dep': {
        type: String,
        optional: true,
    },
});

export default Company;
