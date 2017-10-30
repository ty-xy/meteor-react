import { Meteor } from 'meteor/meteor';

Meteor.methods({
    addUserChat(friendId) {
        Meteor.users.update(
            Meteor.userId(),
            {
                $push: {
                    'profile.chatList': {
                        type: 'user',
                        userId: friendId,
                        time: new Date(),
                    },
                },
            },
        );
    },
});
