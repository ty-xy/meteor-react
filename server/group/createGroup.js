import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';

Meteor.methods({
    // name: 群聊/团队名称, members: 群聊成员, type: group/team 区分是个人群聊和团队群聊, companyId: 公司大群聊
    async createGroup({ name, members, type = 'group', companyId = '', avatar = 'http://oxldjnom8.bkt.clouddn.com/groupAvatar.png' }) {
        let groupMembers = [];
        if (type === 'team') {
            if (members[0] && members[0].userId) {
                for (const value of Object.values(members)) {
                    groupMembers.push(value.userId);
                }
            } else {
                groupMembers = members.concat();
            }
        } else {
            groupMembers = members.concat();
        }
        const newGroup = {
            createdAt: new Date(),
            name,
            avatar,
            members: groupMembers,
            admin: Meteor.userId(),
            notice: '',
            noticeTime: new Date(),
            isDisturb: false,
            stickTop: {
                value: false,
                createdAt: new Date(),
            },
            type,
            companyId,
        };
        Group.schema.validate(newGroup);
        const groupId = await Group.insert(newGroup);
        await groupMembers.map((user =>
            Meteor.users.update(
                { _id: user },
                {
                    $push: {
                        'profile.groups': groupId,
                        'profile.chatList': {
                            type: 'group',
                            groupId,
                            time: new Date(),
                        },
                    },
                },
            )
        ));
        return groupId;
    },
});
