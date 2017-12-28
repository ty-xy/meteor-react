import { Meteor } from 'meteor/meteor';

import Messages from '../../imports/schema/message';

Meteor.methods({
    getContactListNum({ chatList }) {
        chatList.forEach((item, index) => {
            const allNum = Messages.find({ 'to.userId': Meteor.userId(), groupId: chatList[index].groupId }).count();
            const isReadNum = Messages.find({ to: { userId: Meteor.userId(), isRead: true }, groupId: chatList[index].groupId }).count();
            console.log('allNum', allNum, isReadNum);
            item.unreadMessage = allNum - isReadNum;
            item.lastMessage = null;
        });
        return chatList;
    },
});
