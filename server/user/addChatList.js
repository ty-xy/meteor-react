import { Meteor } from 'meteor/meteor';

import UserUtil from '../../imports/util/user';

Meteor.methods({
    addChatList(chatId, type) {
        const chatList = UserUtil.getChatList();
        if (chatList.find(j => j[type] === chatId)) {
            return;
        }
        if (chatId === Meteor.userId()) {
            return;
        }
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
