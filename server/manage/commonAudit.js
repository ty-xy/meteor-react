import { Meteor } from 'meteor/meteor';

import CommonAudit from '../../imports/schema/commonAudit';

Meteor.methods({
    createCommonAudit({ userId, file, approvers, copy, content, detail, img, status, type, company, comments }) {
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
            comments,
            status,
            type,
            company,
            approvers,
            copy,
            content,
            img,
            file,
            detail,
        };
        CommonAudit.schema.validate(newLeave);
        CommonAudit.insert(newLeave);
    },
    // 删除
    deleteCommonAudit({ _id }) {
        CommonAudit.remove({ _id });
    },
});
