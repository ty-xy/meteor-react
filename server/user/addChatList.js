import { Meteor } from 'meteor/meteor';

Meteor.methods({
    addChatList(chatId, type) {
        if (type === 'userId') {
            Meteor.users.update(
                Meteor.userId(),
                {
                    $push: {
                        'profile.chatList': {
                            type: 'user',
                            userId: chatId,
                            time: new Date(),
                        },
                    },
                },
            );
        } else if (type === 'groupId') {
            Meteor.users.update(
                Meteor.userId(),
                {
                    $push: {
                        'profile.chatList': {
                            type: 'group',
                            groupId: chatId,
                            time: new Date(),
                        },
                    },
                },
            );
        } else {
            console.log(type);
        }
    },
});
