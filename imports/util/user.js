import { Meteor } from 'meteor/meteor';

const UserUtil = {
    getProfile() {
        const { profile = {} } = Meteor.user() || {};
        return profile;
    },
    getProfileWithDefault() {
        const { profile = {} } = Meteor.user() || {};
        return {
            name: profile.name || '',
            avatar: profile.name || '',
            avatarColor: profile.name || '',
            friends: profile.friends || [],
            groups: profile.groups || [],
            chatList: profile.chatList || [],
        };
    },

    getName() {
        return UserUtil.getProfile().name || '';
    },
    getAvatar() {
        return UserUtil.getProfile().avatar || '';
    },
    getAvatarColor() {
        return UserUtil.getProfile().avatarColor || 'white';
    },
    getFriends() {
        return UserUtil.getProfile().friends || [];
    },
    getGroups() {
        return UserUtil.getProfile().groups || [];
    },
    getChatList() {
        return UserUtil.getProfile().chatList || [];
    },
};

export default UserUtil;
