import { Meteor } from 'meteor/meteor';

import CheckBill from '../../imports/schema/checkBill';

Meteor.methods({
    createCheckBill({ userId, file, approvers, copy, total, details, img, comments, status, type, company }) {
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
            approvers,
            copy,
            total,
            img,
            file,
            details,
            userId,
            comments,
            status,
            type,
            company,
        };
        CheckBill.schema.validate(newLeave);
        CheckBill.insert(newLeave);
    },
    // 删除
    deleteCheckBill({ _id }) {
        CheckBill.remove({ _id });
    },
});
