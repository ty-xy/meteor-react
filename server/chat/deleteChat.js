import { Meteor } from 'meteor/meteor';

Meteor.methods({
    deleteChat(chatId, type) {
        if (type === 'user') {
            Meteor.users.update(
                { _id: Meteor.userId() },
                {
                    $pull: {
                        'profile.chatList': {
                            groupId: chatId,
                        },
                    },

                },
            );
        } else if (type === 'group' || type === 'team') {
            Meteor.users.update(
                { _id: Meteor.userId() },
                {
                    $pull: {
                        'profile.chatList': {
                            groupId: chatId,
                        },
                    },

                },
            );
        } else {
            console.log(type);
        }
    },
});
