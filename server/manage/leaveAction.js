import { Meteor } from 'meteor/meteor';

import leave from '../../imports/schema/leave';

Meteor.methods({
    createLeave({ username, approvers, copy, daynum, endAt, startAt, img, reason, type }) {
        const newLeave = {
            createdAt: new Date(),
            username,
            approvers,
            copy,
            daynum,
            endAt,
            startAt,
            img,
            reason,
            type,
        };
        leave.schema.validate(newLeave);
        leave.insert(newLeave);
    },
    // 删除
    deleteLeave({ _id }) {
        leave.remove({ _id });
    },
});
