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
    'deps.$.id': {
        type: String,
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
    // 成员Id
    'members.$.userId': {
        type: String,
    },
    // 员工号
    'members.$.code': {
        type: String,
        optional: true,
    },
    // 入职时间
    'members.$.entryTime': {
        type: String,
        optional: true,
    },
    // 办公地点
    'members.$.location': {
        type: String,
        optional: true,
    },
    // 备注
    'members.$.comment': {
        type: String,
        optional: true,
    },
    // 职位
    'members.$.pos': {
        type: String,
        optional: true,
    },
    // 所属部门
    'members.$.dep': {
        type: String,
        optional: true,
    },
});

export default Company;
