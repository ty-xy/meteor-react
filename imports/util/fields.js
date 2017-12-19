export default {
    user: {
        username: 1,
        'profile.name': 1,
        'profile.avatar': 1,
        'profile.avatarColor': 1,
        'profile.isHideInfo': 1,
        'profile.verifyFriend': 1,
        'profile.company': 1,
        'profile.mainCompany': 1,
    },
    searchUser: {
        'profile.name': 1,
        'profile.avatar': 1,
        'profile.avatarColor': 1,
    },
    searchGroup: {
        name: 1,
        avatar: 1,
    },
    searchMessage: {
        content: 1,
        from: 1,
        to: 1,
    },
    searchAllUser: {
        createdAt: 1,
        'profile.name': 1,
        'profile.avatar': 1,
        'profile.avatarColor': 1,
    },
    searchAllGroup: {
        name: 1,
        avatar: 1,
        admin: 1,
        createdAt: 1,
    },
    searchAllFile: {
        createdAt: 1,
        name: 1,
        from: 1,
        url: 1,
    },
    searchTask: {
        name: 1,
        createTime: 1,
        memberId: 1,
    },
    createdcompany: {
        name: 1,
        logo: 1,
    },
    companyName: {
        name: 1,
    },
    // 选择人员时的团队
    searchCompany: {
        name: 1,
        deps: 1,
        members: 1,
    },
    getUsername: {
        username: 1,
        'profile.name': 1,
        'profile.mainCompany': 1,
    },
};
