import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    createCompany({ name, admin, deps = [] }) {
        const newCompany = {
            createdAt: new Date(),
            name,
            admin,
            deps,
        };
        Company.schema.validate(newCompany);
        Company.insert(newCompany);
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
});
