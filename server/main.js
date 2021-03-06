import {
    Meteor,
} from 'meteor/meteor';
// import http from 'http';
// import socketIO from 'socket.io';


import Message from '../imports/schema/message';
import Group from '../imports/schema/group';
import fields from '../imports/util/fields';
import Company from '../imports/schema/company';
import Notice from '../imports/schema/notice';
import Notification from '../imports/schema/notification';
import Log from '../imports/schema/log';
import Project from '../imports/schema/project';
import Task from '../imports/schema/task';
import TaskBoard from '../imports/schema/taskBoard';
import Leave from '../imports/schema/leave';
import Business from '../imports/schema/business';
import CheckBill from '../imports/schema/checkBill';
import CommonAudit from '../imports/schema/commonAudit';
import ProjectMember from '../imports/schema/projectmember';
import ProjectFile from '../imports/schema/projectfile';

import TaskList from '../imports/schema/taskList';
import File from '../imports/schema/file';

import Video from '../imports/schema/video';

// if (Meteor.isServer) {
//     Message.rawCollection().createIndex({ groupId: 1 }, { unique: true });
// }

// Meteor.startup(() => {
//     // Server
//     const server = http.createServer();
//     const io = socketIO(server);

//     // New client
//     io.on('connection', (socket) => {
//         socket.emit('news', { hello: 'world' });
//         console.log('new socket client');
//     });
//     io.on('message', (socket) => {
//         console.log(111, socket.data);
//     });

//     // Start server
//     try {
//         server.listen(3002);
//     } catch (e) {
//         console.error('启动socket.io服务失败', e);
//     }
// });

Meteor.publish('users', () => Meteor.users.find(
    {},
    {
        fields: fields.user,
    },
));

Meteor.publish('message', channels => Message.find(channels || {}));
Meteor.publish('group', () => Group.find({}));
Meteor.publish('files', () => File.find({}));

Meteor.publish('project', () => Project.find({}));
Meteor.publish('taskboard', () => TaskBoard.find({}));
Meteor.publish('tasklist', () => TaskList.find({}));
Meteor.publish('task', () => Task.find({}));
Meteor.publish('projectmember', () => ProjectMember.find({}));
Meteor.publish('projectfile', () => ProjectFile.find({}));

Meteor.publish('company', () => Company.find({}));

Meteor.publish('log', () => Log.find({}));

Meteor.publish('notice', () => Notice.find({}));
Meteor.publish('notification', () => Notification.find());

Meteor.publish('leave', () => Leave.find({}));
Meteor.publish('business', () => Business.find({}));
Meteor.publish('checkbill', () => CheckBill.find({}));
Meteor.publish('commonaudit', () => CommonAudit.find({}));

Meteor.publish('video', () => Video.find({}));

