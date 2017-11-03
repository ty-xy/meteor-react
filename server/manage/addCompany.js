import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    createCompany({ name, admin }) {
        const newCompany = {
            createdAt: new Date(),
            name,
            admin,
        };
        Company.schema.validate(newCompany);
        Company.insert(newCompany);
    },
    // 更新职位
    updatePosition({ name, _id, department }) {
        const newCompany = {
            createdAt: new Date(),
            name,
            department,
        };
        Company.schema.validate(newCompany);
        Company.update(
            { _id },
            {
                $set: newCompany,
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
});
