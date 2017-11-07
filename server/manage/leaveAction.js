import { Meteor } from 'meteor/meteor';

import leave from '../../imports/schema/leave';
import business from '../../imports/schema/business';
import checkBill from '../../imports/schema/checkBill';
import commonAudit from '../../imports/schema/commonAudit';

Meteor.methods({
    createLeave({ approvers, copy, daynum, endAt, startAt, img, reason, type, status, comments, userId }) {
        const newLeave = {
            createdAt: new Date(),
            userId,
            approvers,
            copy,
            daynum,
            endAt,
            startAt,
            img,
            reason,
            type,
            status,
            comments,
        };
        leave.schema.validate(newLeave);
        leave.insert(newLeave);
    },
    updateAudit({ comment, userId, _id, type, status }) {
        const newComment = {
            comment,
            userId,
            createdAt: new Date(),
        };
        const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他'];
        switch (type) {
        case '出差':
            business.update();
            break;
        case '报销':
            checkBill.update();
            break;
        case '通用审批':
            commonAudit.update();
            break;
        default:
            if (types.indexOf(type) > -1) {
                const getLeave = leave.findOne({ _id });
                const comments = getLeave.comments || [];
                comments.push(newComment);
                const res = {
                    status,
                    comments,
                };
                console.log('res', res);
                leave.update(
                    { _id },
                    {
                        $set: res,
                    },
                );
            }
            break;
        }
    },
    // 删除
    deleteLeave({ _id }) {
        leave.remove({ _id });
    },
});
