import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    // 创建公司/团队 必传字段: name,industryType
    createCompany({ name, industryType, residence, logo = 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png', members = [] }) {
        const newCompany = {
            createdAt: new Date(),
            name,
            admin: Meteor.userId(),
            logo,
            industryType,
            residence,
            members,
        };
        Company.schema.validate(newCompany);
        const companyId = Company.insert(newCompany);
        // 创建爱完成后,需自动创建,需要在chatList里添加
        members.map((user =>
            Meteor.users.update(
                { _id: user.userId },
                {
                    $push: {
                        'profile.company': companyId,
                        'profile.chatList': {
                            type: 'team',
                            companyId,
                            time: new Date(),
                        },
                    },
                },
            )
        ));
        return companyId;
    },
    // 修改公司/团队信息
    changeCompanyInfo(companyId, { name, industryType, residence, logo = 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png' }) {
        Company.update(
            { _id: companyId },
            {
                $set: {
                    name,
                    logo,
                    industryType,
                    residence,
                },
            },
        );
    },
    // 更换主管理员
    changeMainManage(companyId, newManageId) {
        Company.update(
            { _id: companyId },
            {
                $set: {
                    admin: newManageId,
                },
            },
        );
    },
    // 增加部门
    addDepartment({ _id, id, name, isAutoChat, admin = '', avatar = '' }) {
        const newCompany = {
            id,
            name,
            isAutoChat, // 是否自动创建部门群聊
            admin,
            avatar,
        };
        let groupId = '';
        Company.update(
            { _id },
            {
                $push: { deps: newCompany },
            },
            (error, res) => {
                if (res && isAutoChat) {
                    Meteor.call(
                        'createGroup',
                        { name, members: [], type: 'team' },
                        (err, groupid) => {
                            if (err) {
                                return false;
                            }
                            console.log('groupid', groupid);
                            groupId = groupid;
                            newCompany.groupId = groupId;
                            Company.update(
                                { _id, 'deps.id': id },
                                {
                                    $set: { 'deps.$': newCompany },
                                },
                                (e, r) => {
                                    if (error) {
                                        console.log('e', e);
                                    }
                                    if (r) {
                                        console.log('将群聊更新进部门信息', groupid);
                                    }
                                },
                            );
                        },
                    );
                }
            },
        );
    },
    // 更新部门
    editCompanyDep({ companyId, name, id, isAutoChat, admin = '', groupId, avatar = '' }) {
        const dep = {
            name,
            isAutoChat,
            admin,
            avatar,
            id,
            groupId,
        };
        Company.update(
            { _id: companyId, 'deps.id': id },
            {
                $set: { 'deps.$': dep },
            },
            (err, result) => {
                if (err) {
                    return false;
                }
                if (result) {
                    Meteor.call(
                        'changeGroupName',
                        groupId, name,
                    );
                }
            },
        );
    },
    // delCompanyDep 删除部门， 且删除群聊
    delCompanyDep({ companyId, id, groupId }) {
        Company.update(
            { _id: companyId },
            {
                $pull: { deps: { id } },
            },
            (err, res) => {
                if (err) {
                    return false;
                }
                if (res) {
                    Meteor.call(
                        'deleteGroup',
                        groupId,
                    );
                }
            },
        );
    },
    // 批量设置部门人员
    batchSetDep({ companyId, _users }) {
        _users.forEach((item) => {
            Company.update(
                { _id: companyId, 'members.userId': item.userId },
                {
                    $set: { 'members.$': item },
                },
            );
        });
    },
    // 公司添加人员
    addMember({ companyId, userId, name, dep = '', pos }) {
        const member = {
            userId,
            dep,
            pos,
            name,
        };
        Company.update(
            { _id: companyId },
            {
                $push: { members: member },
            },
        );
    },
    // 修改人员
    editMember({ companyId, userId, name, dep = '', pos }) {
        const member = {
            userId,
            dep,
            pos,
            name,
        };
        // console.log('editMember', companyId, member);
        Company.update(
            { _id: companyId, 'members.userId': userId },
            {
                $set: { 'members.$': member },
            },
        );
    },
    // 删除人员
    delCompanyMember({ companyId, userId }) {
        Company.update(
            { _id: companyId },
            {
                $pull: { members: { userId } },
            },
        );
    },
    // 解散团队
    deleteCompany(companyId) {
        const companyMembers = Company.findOne({
            _id: companyId,
        });
        companyMembers.members.map(user => (
            Meteor.users.update({
                _id: user,
            }, {
                $pull: {
                    'profile.company': companyId,
                    'profile.chatList': {
                        companyId,
                    },
                },

            })
        ));
        Company.remove({
            _id: companyId,
        });
        // Messages.remove({
        //     to: groupId,
        // });
    },
});
