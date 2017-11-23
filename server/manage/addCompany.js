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
                { _id: user },
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
        return members;
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
            isAutoChat,
            admin,
            avatar,
        };
        // isAutoChat 是否自动创建部门群聊
        Company.update(
            { _id },
            {
                $push: { deps: newCompany },
            },
        );
    },
    // 更新部门
    editCompanyDep({ companyId, name, id }) {
        // const dep = {
        //     name,
        // };
        Company.update(
            { _id: companyId, 'deps.id': id },
            {
                $set: { name },
            },
        );
    },
    // 公司添加人员
    addMember({ companyId, userId, name, dep, pos }) {
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
    editMember({ companyId, userId, name, dep, pos }) {
        const member = {
            userId,
            dep,
            pos,
            name,
        };
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
