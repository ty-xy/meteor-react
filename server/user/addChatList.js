import { Meteor } from 'meteor/meteor';

import UserUtil from '../../imports/util/user';

Meteor.methods({
    addChatlist(chatId, user) {
        console.log(Meteor.users.findOne({ _id: user }));
        const temporaryChat = Meteor.users.findOne({ _id: user }).profile.chatList.find(item => item.groupId && item.groupId === chatId);
        console.log(temporaryChat);
        if (temporaryChat) {
            return;
        }
        Meteor.users.update(
            { _id: user },
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
    },
    addChatList(chatId, type) {
        const chatList = UserUtil.getChatList();
        if (chatList.find(j => j[type] === chatId)) {
            return;
        }
        if (chatId === Meteor.userId()) {
            return;
        }
        // if (type === 'userId') {
        //     Meteor.users.update(
        //         Meteor.userId(),
        //         {
        //             $push: {
        //                 'profile.chatList': {
        //                     type: 'user',
        //                     userId: chatId,
        //                     time: new Date(),
        //                 },
        //             },
        //         },
        //     );
        // } else
        if (type === 'groupId') {
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
