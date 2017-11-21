import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    // 创建公司/团队 必传字段: name,industryType
    createCompany({ name, industryType, residence, logo = 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png', deps = [] }) {
        const newCompany = {
            createdAt: new Date(),
            name,
            admin: Meteor.userId(),
            deps,
            logo,
            industryType,
            residence,
        };
        Company.schema.validate(newCompany);
        return Company.insert(newCompany);
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
    updateMember({ _id, member }) {
        const members = Company.findOne({ _id }).members || [];
        members.push({
            userId: member,
            position: [],
            department: [],
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
