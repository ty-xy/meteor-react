import { Meteor } from 'meteor/meteor';

Meteor.methods({
    deleteFriend(friendId) {
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $pull: {
                    'profile.friends': friendId,
                },

            },
        );
        Meteor.users.update(
            { _id: friendId },
            {
                $pull: {
                    'profile.friends': Meteor.userId(),
                },

            },
        );
    },
});
