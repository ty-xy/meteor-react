import { Meteor } from 'meteor/meteor';

Meteor.methods({
    deleteFriend(friendId) {
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $pull: {
                    'profile.friends': friendId,
                    'profile.chatList': {
                        userId: friendId,
                    },
                },

            },
        );
        Meteor.users.update(
            { _id: friendId },
            {
                $pull: {
                    'profile.friends': Meteor.userId(),
                    'profile.chatList': {
                        userId: Meteor.userId(),
                    },
                },

            },
        );
    },
});
