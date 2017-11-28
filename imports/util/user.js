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
    getMainCompany() {
        return UserUtil.getProfile().mainCompany || '';
    },
    // 获取所在的公司列表
    getCompanyList() {
        return UserUtil.getProfile().company || [];
    },
    // 获取我创建的公司列表
    getCreatedCompany() {
        return UserUtil.getProfile().createdCompany || [];
    },
    // 获取后台当前的公司
    getCurrentBackendCompany() {
        return UserUtil.getProfile().currentBackendCompany || '';
    },
    // 获取公司groupId
    getCompanyGrounpId() {
        return UserUtil.getProfile().groupId || '';
    },
};
export const userIdToInfo = {
    getProfile(users = [], userId) {
        let res = {};
        users.forEach((item) => {
            if (item._id === userId) {
                res = {
                    ...item,
                    ...item.profile,
                };
                // return userIdToInfo.userInfo;
            }
        });
        return res;
    },
    getUsername(users, userId) {
        return userIdToInfo.getProfile(users, userId).username || '';
    },
    getName(users, userId) {
        return userIdToInfo.getProfile(users, userId).name || '';
    },
    getAvatar(users, userId) {
        return userIdToInfo.getProfile(users, userId).avatar || '';
    },
    getMaincompany(users, userId) {
        return userIdToInfo.getProfile(users, userId).mainCompany || '';
    },
    getDep(users, userId) {
        let res = '暂无部门';
        (users || []).forEach((item) => {
            if (item.userId === userId) {
                res = item.dep;
            }
        });
        return res;
    },
};

export default UserUtil;
