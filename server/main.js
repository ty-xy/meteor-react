import { Meteor } from 'meteor/meteor';

import Messages from '../imports/schema/message';

Meteor.publish('messages', () => Messages.find({}));
