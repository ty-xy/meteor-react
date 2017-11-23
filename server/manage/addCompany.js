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
    addDepartment({ _id, name, isAutoChat, admin = '', avatar = '' }) {
        const newCompany = {
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
    updateDepartment({ deparment, _id }) {
        const departments = Company.findOne({ _id }).department || [];
        departments.push(deparment);
        const newCompany = {
            createdAt: new Date(),
            department: departments,
            name: Company.findOne({ _id }).name,
        };
        Company.schema.validate(newCompany);
        Company.update(
            { _id },
            {
                $set: newCompany,
            },
        );
    },
    // 公司添加人员
    addMember({ _id, userId, name, dep, pos, phone }) {
        const member = {
            userId,
            username: phone,
            dep,
            pos,
            name,
        };
        Company.update(
            { _id },
            {
                $push: { members: member },
            },
        );
    },
    // 公司部门添加人员
    updateMemberDep({ _id, member, department }) {
        const members = Company.findOne({ _id }).members || [];
        members.forEach((item) => {
            if (item.userId === member) {
                item.department.push(department);
            }
        });
        console.log('members', members);
        const newCompany = {
            createdAt: new Date(),
            members,
            name: Company.findOne({ _id }).name,
        };
        Company.schema.validate(newCompany);
        Company.update(
            { _id },
            {
                $set: newCompany,
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
