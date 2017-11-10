import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const Project = new Mongo.Collection('project');

Project.schema = new SimpleSchema({
    // 头像地址
    headPortrait: {
        type: String,
    },
    // 项目名称
    name: {
        type: String,
    },
    // 项目简介
    intro: {
        type: String,
    },
    // // 项目归属 1：私有，2：公有
    affiliation: {
        type: String,
    },
    // // 项目模板id
    // formBoard: {
    //     type: String,
    //     regEx: SimpleSchema.RegEx.Id,
    // },
    // // 创建人id
    // creater: {
    //     type: String,
    //     regEx: SimpleSchema.RegEx.Id,
    // },
    // 创建时间
    createTime: {
        type: Date,
    },
    // // 是否归档 1：未归档，2：已归档
    pigeonhole: {
        type: Number,
    },

});


export default Project;
