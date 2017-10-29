import { Meteor } from 'meteor/meteor';

import notice from '../../imports/schema/notice';

Meteor.methods({
    createNotice({ username, title, content, group, author, file, img, up, isSecrecy }) {
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
        };
        notice.schema.validate(newLog);
        notice.insert(newLog);
    },
    // 修改
    updateNotice({ _id, username, title, content, group, author, file, img, up, isSecrecy }) {
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
    // zhiding
    setNoticeUp({ _id, _idOld }) {
        notice.update(
            { _id },
            {
                $set: { up: true },
            },
        );
        notice.update(
            { _id: _idOld },
            {
                $set: { up: false },
            },
        );
        // notice.sort({ up });
    },
});
