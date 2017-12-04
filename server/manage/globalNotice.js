import { Meteor } from 'meteor/meteor';

import notice from '../../imports/schema/notice';

Meteor.methods({
    /*
        创建全局通知
        @params from 发布人
        @parmas userCompany 发布人所在团队
        @toMembers 接受对象
    */
    createGlobalNotice({ from, userCompany, toMembers, noticeType }) {
        const obj = {
            from,
            userCompany,
            toMembers,
            createdAt: new Date(),
            noticeType,
        };
        notice.schema.validate(obj);
        const _id = notice.insert(obj);
        return _id;
    },
    // 查看日志
    readLog(_id) {
        notice.update(
            { _id, 'toMembers.userId': Meteor.userId() },
            { $set: { 'toMembers.$.isRead': true } },
            (err) => {
                if (err) {
                    return err;
                }
                return true;
            },
        );
    },
    // 关闭查看
    rejectLook(_id) {
        notice.update(
            { _id, 'toMembers.userId': Meteor.userId() },
            { $set: { 'toMembers.$.rejectRead': true } },
        );
    },
});
