import { Meteor } from 'meteor/meteor';

import Log from '../../imports/schema/log';

Meteor.methods({
    createLog({ username, type, finish, plan, help, file, img, peo, nickname, group }) {
        const newLog = {
            createdAt: new Date(),
            username,
            nickname,
            type,
            finish,
            plan,
            help,
            file,
            img,
            peo,
            group,
        };
        Log.schema.validate(newLog);
        Log.insert(newLog);
    },
    // 修改
    updateLog({ type, _id, finish, username, nickname, plan, help, file, img, peo, group }) {
        const updateLog = {
            createdAt: new Date(),
            type,
            finish,
            plan,
            help,
            file,
            img,
            peo,
            group,
            username,
            nickname,
        };
        Log.schema.validate(updateLog);
        Log.update(
            { _id },
            {
                $set: updateLog,
            },
        );
    },
    // 删除
    deleteLog({ _id }) {
        Log.remove({ _id });
    },
});
