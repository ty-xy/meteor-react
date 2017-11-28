import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    // 创建公司/团队 必传字段: name,industryType
    async createCompany({ name, industryType, residence, logo = 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png', members = [] }) {
        // 创建完团队,自动创建公司的群聊

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
        const companyId = await Company.insert(newCompany);
        // 是我创建的需要在createdCompany和company里添加
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $push: {
                    'profile.createdCompany': companyId,
                    'profile.company': companyId,
                },
            },
        );
        Meteor.call('createGroup', { name, members, type: 'team' }, (err, res) => {
            if (err) {
                return false;
            }
            Company.update(
                { _id: companyId },
                {
                    $set: {
                        groupId: res,
                    },
                },
            );
        });
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
    // 添加子管理员
    addSubAdmin(companyId, subManageIds) {
        subManageIds.map(subManageId =>
            Company.update(
                { _id: companyId },
                {
                    $push: {
                        subAdmin: subManageId,
                    },
                },
            ),
        );
    },
    // 删除子管理员
    deleteSubAdmin(companyId, subManageId) {
        Company.update(
            { _id: companyId },
            {
                $pull: {
                    subAdmin: subManageId,
                },
            },
        );
    },
    // 创建部门且创建群聊
    addDepartment({ _id, id, name, isAutoChat, admin = '', avatar = '', members }) {
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
                        { name, members, type: 'team', superiorId: _id },
                        (err, groupid) => {
                            if (err) {
                                return false;
                            }
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
    // 更新部门名称
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
                if (result && isAutoChat) {
                    Meteor.call(
                        'changeGroupName',
                        groupId, name,
                    );
                }
            },
        );
    },
    // delCompanyDep 删除部门， 且删除群聊
    delCompanyDep({ companyId, id, groupId, isAutoChat }) {
        Company.update(
            { _id: companyId },
            {
                $pull: { deps: { id } },
            },
            (err, res) => {
                if (err) {
                    return false;
                }
                if (res && isAutoChat) {
                    Meteor.call(
                        'deleteGroup',
                        groupId,
                    );
                }
            },
        );
    },
    // 批量设置部门人员
    batchSetDep({ companyId, _users, groupId, oldgroup }) {
        _users.forEach((item) => {
            Company.update(
                { _id: companyId, 'members.userId': item.userId },
                {
                    $set: { 'members.$': item },
                },
                (err, res) => {
                    if (res && item.dep) {
                        Meteor.call(
                            'deleteMember',
                            oldgroup, item.userId,
                            (e) => {
                                if (!e) {
                                    Meteor.call(
                                        'addGroupMembers',
                                        {
                                            groupId,
                                            newMembers: [item.userId],
                                        },
                                    );
                                }
                            },
                        );
                    }
                },
            );
        });
    },
    // 公司添加人员
    addMember({ companyId, userId, name, dep = '', groupId, pos }) {
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
            (err, res) => {
                if (res && dep) {
                    Meteor.call(
                        'addGroupMembers',
                        {
                            groupId,
                            newMembers: [userId],
                        },
                    );
                }
            },
        );
    },
    // 修改人员
    editMember({ companyId, userId, name, dep = '', groupId, oldgroup, pos }) {
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
            (err, res) => {
                if (res && dep) {
                    Meteor.call(
                        'deleteMember',
                        oldgroup, userId,
                    );
                    Meteor.call(
                        'addGroupMembers',
                        {
                            groupId,
                            newMembers: [userId],
                        },
                    );
                }
            },
        );
    },
    // 删除人员
    delCompanyMember({ companyId, userId, groupId }) {
        Company.update(
            { _id: companyId },
            {
                $pull: { members: { userId } },
            },
            (err, res) => {
                if (res) {
                    Meteor.call(
                        'deleteMember',
                        groupId, userId,
                    );
                }
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
                    'profile.createdCompany': companyId,
                    'profile.chatList': {
                        companyId,
                    },
                },
                $set: {
                    'profile.currentBackendCompany': '',
                },

            })
        ));
        // 在公司列表中删除
        Company.remove({
            _id: companyId,
        });
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $pull: {
                    'profile.createdCompany': companyId,
                },
            },
        );
        // Messages.remove({
        //     to: groupId,
        // });
    },
    // 选择后台的当前公司
    selectBackendTeam(companyId) {
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $set: {
                    'profile.currentBackendCompany': companyId,
                },
            },
        );
    },
    // 安全退出后台
    quitBackendTeam() {
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $set: {
                    'profile.currentBackendCompany': '',
                },
            },
        );
    },
});
