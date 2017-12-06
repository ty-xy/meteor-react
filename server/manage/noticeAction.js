import { Meteor } from 'meteor/meteor';

import notice from '../../imports/schema/notification';
import UserUtil from '../../imports/util/user';

Meteor.methods({
    createNotice({ title, content, group, file, img, up, isSecrecy, toMembers }) {
        const newLog = {
            createdAt: new Date(),
            username: UserUtil.getName(),
            userId: Meteor.userId(),
            title,
            content,
            group,
            file,
            img,
            isSecrecy,
            up,
            company: UserUtil.getMainCompany(),
        };
        notice.schema.validate(newLog);
        const _id = notice.insert(newLog);
        console.log('toMembers', toMembers, _id);
        if (_id) {
            const res = {
                from: Meteor.userId(),
                userCompany: UserUtil.getMainCompany(),
                toMembers,
                noticeType: '公告',
                logId: _id,
            };
            console.log('res', res);
            Meteor.call(
                'createGlobalNotice',
                (res),
                (err, noticeId) => {
                    notice.update(
                        { _id },
                        { $set: { noticeId } },
                    );
                },
            );
        }
    },
    // 修改
    updateNotice({ _id, username, title, content, group, author, file, img, up, isSecrecy, company }) {
        const updateLog = {
            createdAt: new Date(),
            username,
            title,
            content,
            group,
            author,
            file,
            img,
            isSecrecy,
            up,
            company,
        };
        notice.schema.validate(updateLog);
        notice.update(
            { _id },
            {
                $set: updateLog,
            },
        );
    },
    // 删除
    deleteNotice({ _id }) {
        notice.remove({ _id });
    },
    // 置顶
    setNoticeUp({ _id, _idOld, val }) {
        if (_id === _idOld) {
            notice.update(
                { _id },
                {
                    $set: { up: !val },
                },
            );
        } else {
            notice.update(
                { _id },
                {
                    $set: { up: !val },
                },
            );
            notice.update(
                { _id: _idOld },
                {
                    $set: { up: false },
                },
            );
        }
    },
});
