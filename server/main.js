import { Meteor } from 'meteor/meteor';

import Message from '../imports/schema/message';

Meteor.publish('message', () => Message.find({}));
Meteor.publish('userData', () => Meteor.user());
