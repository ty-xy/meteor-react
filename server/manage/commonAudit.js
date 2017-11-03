import { Meteor } from 'meteor/meteor';

import CommonAudit from '../../imports/schema/commonAudit';

Meteor.methods({
    createCommonAudit({ username, file, approvers, copy, content, detail, img }) {
        const newLeave = {
            createdAt: new Date(),
            username,
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
