import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const ScheduleMember = new Mongo.Collection('schedulemember');

ScheduleMember.SimpleSchema = new SimpleSchema({
    // 日程id
    scheduleId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 成员id
    member: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    // 是否提醒
    remind: {
        type: Boolean,
    },
    // 提醒时间 
    remindTime: {
        type: Date,
    },
});


export default ScheduleMember;
