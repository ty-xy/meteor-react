import { Meteor } from 'meteor/meteor';

import Log from '../../imports/schema/log';

Meteor.methods({
    createLog({ username, type, finish, plan, help, file, img, peo, group }) {
        const newLog = {
            createdAt: new Date(),
            username,
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
    updateLog({ username, type, _id, finish, plan, help, file, img, peo, group }) {
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
        };
        Log.schema.validate(updateLog);
        Log.update(
            { username, _id },
            {
                $set: updateLog,
            },
        );
    },
});
