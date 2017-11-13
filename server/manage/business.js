import { Meteor } from 'meteor/meteor';

import Business from '../../imports/schema/business';

Meteor.methods({
    createBusiness({ userId, file, approvers, copy, daynum, details, img, reason, comments, status, type, company }) {
        approvers = approvers.map(item => ({ userId: item, isAudit: '待审核' }));
        // 第一个审批人信息通知。
        comments = [
            {
                ...approvers[0],
                content: '',
                createdAt: new Date(),
            },
        ];
        const newLeave = {
            createdAt: new Date(),
            userId,
            approvers,
            copy,
            daynum,
            img,
            file,
            details,
            reason,
            comments,
            status,
            type,
            company,
        };
        Business.schema.validate(newLeave);
        Business.insert(newLeave);
    },
    // 删除
    deleteBusiness({ _id }) {
        Business.remove({ _id });
    },
});
