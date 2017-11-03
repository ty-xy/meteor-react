import { Meteor } from 'meteor/meteor';

import CheckBill from '../../imports/schema/checkBill';

Meteor.methods({
    createCheckBill({ username, file, approvers, copy, total, details, img }) {
        const newLeave = {
            createdAt: new Date(),
            username,
            approvers,
            copy,
            total,
            img,
            file,
            details,
        };
        CheckBill.schema.validate(newLeave);
        CheckBill.insert(newLeave);
    },
    // 删除
    deleteCheckBill({ _id }) {
        CheckBill.remove({ _id });
    },
});
