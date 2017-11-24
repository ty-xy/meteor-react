import { Meteor } from 'meteor/meteor';

import Group from '../../imports/schema/group';

Meteor.methods({
    // name: 群聊/团队名称, members: 群聊成员, type: group/team 区分是个人群聊和团队群聊, superiorId: 团队里面的部门所属的公司ID
    createGroup({ name, members, type = 'group', superiorId = '' }) {
        const newGroup = {
            createdAt: new Date(),
            name,
            avatar: 'http://oxldjnom8.bkt.clouddn.com/groupAvatar.png',
            members,
            admin: Meteor.userId(),
            notice: '',
            noticeTime: new Date(),
            isDisturb: false,
            stickTop: {
                value: false,
                createdAt: new Date(),
            },
            type,
            superiorId,
        };
        Group.schema.validate(newGroup);
        const groupId = Group.insert(newGroup);
        members.map((user =>
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
