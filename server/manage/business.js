import { Meteor } from 'meteor/meteor';

import Business from '../../imports/schema/business';

Meteor.methods({
    createBusiness({ username, file, approvers, copy, daynum, details, img, reason }) {
        const newLeave = {
            createdAt: new Date(),
            username,
            approvers,
            copy,
            daynum,
            img,
            file,
            details,
            reason,
        };
        Business.schema.validate(newLeave);
        Business.insert(newLeave);
    },
    // 删除
    deleteBusiness({ _id }) {
        Business.remove({ _id });
    },
});
