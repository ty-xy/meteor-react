import { Meteor } from 'meteor/meteor';

// import UserUtil from '../../imports/util/user';

Meteor.methods({
    deleteChat(chatId, type) {
        console.log(111, chatId, type);
        // const chatList = UserUtil.getChatList();
        // if (!chatList.find(j => j[type] === chatId)) {
        //     return;
        // }
        // console.log(555, '删除当前的chatId', chatId, type);
        if (type === 'user') {
            // console.log(222);
            Meteor.users.update(
                { _id: Meteor.userId() },
                {
                    $pull: {
                        'profile.chatList': {
                            userId: chatId,
                        },
                    },

                },
            );
        } else if (type === 'group') {
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
