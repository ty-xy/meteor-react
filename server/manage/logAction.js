import { Meteor } from 'meteor/meteor';

import Log from '../../imports/schema/log';

Meteor.methods({
    createLog({ userId, type, finish, plan, help, file, img, peo, nickname, group }) {
        const newLog = {
            createdAt: new Date(),
            userId,
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
    updateLog({ type, _id, finish, userId, nickname, plan, help, file, img, peo, group }) {
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
            userId,
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
