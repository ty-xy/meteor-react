import {
    Meteor,
} from 'meteor/meteor';
import {
    publishComposite,
} from 'meteor/reywood:publish-composite';
import http from 'http';
import socketIO from 'socket.io';


import Message from '../imports/schema/message';
import Group from '../imports/schema/group';
import fields from '../imports/util/fields';
import Company from '../imports/schema/company';
import Notice from '../imports/schema/notice';
import Log from '../imports/schema/log';
import Project from '../imports/schema/project';
import TaskBoard from '../imports/schema/taskBoard';
import Leave from '../imports/schema/leave';
import Business from '../imports/schema/business';
import CheckBill from '../imports/schema/checkBill';
import CommonAudit from '../imports/schema/commonAudit';

import File from '../imports/schema/file';

Meteor.startup(() => {
    // Server
    const server = http.createServer();
    const io = socketIO(server);

    // New client
    io.on('connection', (socket) => {
        socket.emit('news', { hello: 'world' });
        console.log('new socket client');
    });
    io.on('message', (socket) => {
        console.log(111, socket.data);
    });

    // Start server
    try {
        server.listen(3002);
    } catch (e) {
        console.error('启动socket.io服务失败', e);
    }
});


publishComposite('message', {
    find() {
        return Message.find({});
    },
    children: [{
        find(message) {
            message.from = Meteor.users.findOne(
                { _id: message.from },
                {
                    fields: fields.user,
                },
            );
        },
    }],
});

Meteor.publish('users', () => Meteor.users.find(
    {},
    {
        fields: fields.user,
    },
));

Meteor.publish('group', () => Group.find({}));
Meteor.publish('file', () => File.find({}));

Meteor.publish('project', () => Project.find({}));
Meteor.publish('taskboard', () => TaskBoard.find({}));

Meteor.publish('company', () => Company.find({}));

Meteor.publish('log', () => Log.find({}));

Meteor.publish('notice', () => Notice.find({}));

Meteor.publish('leave', () => Leave.find({}));
Meteor.publish('business', () => Business.find({}));
Meteor.publish('checkbill', () => CheckBill.find({}));
Meteor.publish('commonaudit', () => CommonAudit.find({}));
