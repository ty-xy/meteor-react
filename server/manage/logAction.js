import { Meteor } from 'meteor/meteor';

import Log from '../../imports/schema/log';
import UserUtil from '../../imports/util/user';

Meteor.methods({
    createLog({ userId, type, finish, plan, help, file, img, peo, nickname, group, company, cache, toMembers }) {
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
            company,
            cache,
        };
        Log.schema.validate(newLog);
        const _id = Log.insert(newLog);
        if (_id) {
            const res = {
                from: Meteor.userId(),
                userCompany: UserUtil.getMainCompany(),
                toMembers,
                noticeType: type,
            };
            Meteor.call(
                'createGlobalNotice',
                (res),
                (err, noticeId) => {
                    Log.update(
                        { _id },
                        { $set: { noticeId } },
                    );
                },
            );
        }
    },
    // 修改
    updateLog({ type, _id, finish, userId, nickname, plan, help, file, img, peo, group, company, cache }) {
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
            company,
            cache,
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
