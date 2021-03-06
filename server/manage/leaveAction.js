import { Meteor } from 'meteor/meteor';

import leave from '../../imports/schema/leave';
import business from '../../imports/schema/business';
import checkBill from '../../imports/schema/checkBill';
import commonaudit from '../../imports/schema/commonAudit';
import UserUtil from '../../imports/util/user';


Meteor.methods({
    createLeave({ approvers, copy, daynum, endAt, startAt, img, reason, type, status, comments, userId, company }) {
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
            endAt,
            startAt,
            img,
            reason,
            type,
            status,
            comments,
            company,
        };
        leave.schema.validate(newLeave);
        const _id = leave.insert(newLeave);
        // 通知下一级审批人
        if (_id) {
            const res = {
                from: Meteor.userId(),
                userCompany: UserUtil.getMainCompany(),
                toMembers: [approvers[0]],
                noticeType: type,
                logId: _id,
            };
            Meteor.call(
                'createGlobalNotice',
                (res),
                (err, noticeId) => {
                    if (noticeId) {
                        leave.update(
                            { _id },
                            { $set: { noticeId } },
                        );
                    }
                },
            );
        }
    },
    // 处理审批
    updateAudit({ content, userId, _id, type, isAudit, transit }) {
        const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他'];
        let allApp = 0;
        let getLeave = {};
        if (types.indexOf(type) > -1) {
            getLeave = leave.findOne({ _id });
        } else {
            switch (type) {
            case '出差':
                getLeave = business.findOne({ _id });
                break;
            case '报销':
                getLeave = checkBill.findOne({ _id });
                break;
            case '通用审批':
                getLeave = commonaudit.findOne({ _id });
                break;
            default:
                break;
            }
        }

        const comments = getLeave.comments || [];
        let status = '待审核';
        let approvers = [];
        switch (isAudit) {
        case '评论':
            comments.push({
                userId,
                isAudit,
                content,
                createdAt: new Date(),
            });
            approvers = getLeave.approvers;
            break;
        case '拒绝':
            comments.forEach((item) => {
                if (item.userId === userId && item.isAudit === '待审核') {
                    item.isAudit = isAudit;
                    item.content = content;
                    item.createdAt = new Date();
                }
            });
            status = '拒绝';
            getLeave.approvers.forEach((item) => {
                if (item.userId === userId) {
                    item.isAudit = '拒绝';
                }
                approvers.push(item);
            });
            break;
        case '转交':
            comments[comments.length - 1] = {
                userId: transit,
                isAudit: '待审核',
                content,
                createdAt: new Date(),
            };
            approvers = getLeave.approvers;
            approvers.forEach((item) => {
                if (item.userId === userId) {
                    item.isAudit = '待审核';
                    item.userId = transit;
                }
            });
            break;
        case '同意':
            comments.forEach((item) => {
                if (item.userId === userId && item.isAudit === '待审核') {
                    item.isAudit = isAudit;
                    item.content = content;
                    item.createdAt = new Date();
                }
            });
            getLeave.approvers.forEach((item) => {
                if (item.userId === userId) {
                    item.isAudit = '同意';
                }
                approvers.push(item);
            });
            for (let i = 0; i < approvers.length; i++) {
                if (approvers[i].isAudit === '待审核') {
                    allApp++;
                    comments.push({
                        ...approvers[i],
                        content: '',
                        createdAt: new Date(),
                    });
                    // 通知下一个人
                    const res = {
                        from: Meteor.userId(),
                        userCompany: UserUtil.getMainCompany(),
                        toMembers: [approvers[i]],
                        noticeType: type,
                        logId: _id,
                    };
                    Meteor.call(
                        'createGlobalNotice',
                        (res),
                    );
                    break;
                }
            }
            if (allApp === 0) {
                status = '同意';
            }
            break;
        default:
            break;
        }

        // console.log('comments:', userId, isAudit, comments, approvers);

        const res = {
            approvers,
            comments,
            status,
        };
        // console.log('res', res, i, getLeave.approvers.length);
        if (types.indexOf(type) > -1) {
            leave.update(
                { _id },
                {
                    $set: res,
                },
            );
        } else {
            switch (type) {
            case '出差':
                business.update(
                    { _id },
                    {
                        $set: res,
                    },
                );
                break;
            case '报销':
                checkBill.update(
                    { _id },
                    {
                        $set: res,
                    },
                );
                break;
            case '通用审批':
                commonaudit.update(
                    { _id },
                    {
                        $set: res,
                    },
                );
                break;
            default:
                break;
            }
        }
    },
    // 删除
    deleteLeave({ _id }) {
        leave.remove({ _id });
    },
    getCommaudit() {
        return commonaudit.find().fetch();
    },
});
