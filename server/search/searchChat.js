import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    searchChat(pattern) {
        return Messages.find({ content: { $regex: `/${pattern}/` } }).fetch();
    },
});
