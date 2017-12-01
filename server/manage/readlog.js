import { Meteor } from 'meteor/meteor';

import log from '../../imports/schema/log';

Meteor.methods({
    // 查看日志
    readLog(_id) {
        console.log('_id', _id, Meteor.userId());
        log.update(
            { _id, 'peo.userId': Meteor.userId() },
            { $set: { 'peo.$.isRead': true } },
        );
    },
    // 关闭查看
    rejectLook(_id) {
        log.update(
            { _id, 'peo.userId': Meteor.userId() },
            { $set: { 'peo.$.rejectLook': true } },
        );
    },
});
