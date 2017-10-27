import {
    Meteor,
} from 'meteor/meteor';
import {
    publishComposite,
} from 'meteor/reywood:publish-composite';

import Message from '../imports/schema/message';
import Group from '../imports/schema/group';
import fields from '../imports/util/fields';
import Company from '../imports/schema/company';
import Log from '../imports/schema/log';
import Project from '../imports/schema/project';
import TaskBoard from '../imports/schema/taskBoard';
import File from '../imports/schema/file';

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

