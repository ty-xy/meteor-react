import { Meteor } from 'meteor/meteor';

import notice from '../../imports/schema/notification';

Meteor.methods({
    createNotice({ username, title, content, group, author, file, img, up, isSecrecy, company }) {
        const newLog = {
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
        notice.schema.validate(newLog);
        notice.insert(newLog);
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
