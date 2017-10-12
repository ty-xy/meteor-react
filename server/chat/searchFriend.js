import { Meteor } from 'meteor/meteor';

Meteor.methods({
    searchFriend(username) {
        return Meteor.users.findOne({ username });
    },
});
