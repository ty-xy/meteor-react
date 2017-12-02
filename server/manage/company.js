import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';
// import UserUtil from '../../imports/util/user';

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
        Meteor.call('createGroup', { name, members, type: 'team', companyId }, (err, groupId) => {
            if (err) {
                return false;
            }
            Company.update(
                { _id: companyId },
                {
                    $set: {
                        groupId,
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
    changeMainManage(companyId, oldManageId, newManageId) {
        // 从之前主管理员创建的公司中移除,在主管理员创建的公司中添加
        Meteor.users.update(
            { _id: oldManageId },
            {
                $pull: {
                    'profile.createdCompany': companyId,
                },
            },
        );
        Meteor.users.update(
            { _id: newManageId },
            {
                $pull: {
                    'profile.createdCompany': companyId,
                },
            },
        );
        // 更换公司内部的主管理员
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
        const newDep = {
            id,
            name,
            isAutoChat, // 是否自动创建部门群聊
            admin,
            avatar,
            members: [],
        };
        Company.update(
            { _id },
            {
                $push: { deps: newDep },
            },
            (error, res) => {
                if (res && isAutoChat) {
                    Meteor.call(
                        'createGroup',
                        { name, members, type: 'team' },
                        (err, groupId) => {
                            if (err) {
                                return false;
                            }
                            newDep.groupId = groupId;
                            Company.update(
                                { _id, 'deps.id': id },
                                {
                                    $set: { 'deps.$': newDep },
                                    $push: {
                                        subGroupIds: groupId,
                                    },
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
    async delCompanyDep({ companyId, id, groupId, isAutoChat }) {
        await Company.update(
            { _id: companyId },
            {
                $pull: { deps: { id } },
            },
        );

        if (isAutoChat) {
            await Meteor.call(
                'deleteGroup',
                groupId,
            );
            await Company.update(
                { _id: companyId },
                {
                    $pull: {
                        subGroupIds: groupId,
                    },
                },
            );
        }
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
                        );
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
        });
    },
    // 公司添加人员
    addMember({ companyId, userId, dep = '', departmentGroupId, pos, invite, companyGroupId }) {
        console.log('addMember', Meteor.userId(), userId, companyId, dep, departmentGroupId, pos, invite, companyGroupId);
        const member = {
            userId,
            dep,
            pos,
        };
        // if (invite) {
        const company = Company.findOne({ _id: companyId }) || {};
        const { members = [] } = company;
        const res = {};
        (members || []).forEach((item) => {
            if (item.userId === userId) {
                res.done = '你已存在该团队中';
            }
        });
        if (res.done) {
            return res;
        }
        // }
        Company.update(
            { _id: companyId },
            {
                $push: { members: member },
            },
            (err, r) => {
                if (r) {
                    if (dep) {
                        // 加入部门
                        Company.update(
                            { _id: companyId, 'deps.id': dep },
                            {
                                $push: { 'deps.$.members': userId },
                            },
                        );
                        // 加入公司部门群聊
                        Meteor.call(
                            'addGroupMembers',
                            {
                                groupId: departmentGroupId,
                                newMembers: [userId],
                            },
                        );
                    }
                    // 加入公司大群聊
                    Meteor.call(
                        'addGroupMembers',
                        {
                            groupId: companyGroupId,
                            newMembers: [userId],
                        },
                    );
                    // 更新人员所在公司
                    Meteor.users.update(
                        { _id: userId },
                        {
                            $push: {
                                'profile.company': companyId,
                            },
                        },
                    );
                }
            },
        );

        return Company.findOne({ _id: companyId }) ? Company.findOne({ _id: companyId }).name : '邀请出错';
    },
    // 修改人员
    async editMember({ companyId, userId, dep = '', oldDep, groupId, oldgroup, pos }) {
        const member = {
            userId,
            dep,
            pos,
        };
        // console.log('editMember', companyId, member);
        if (dep) {
            await Company.update(
                { _id: companyId, 'members.userId': userId },
                {
                    $set: { 'members.$': member },
                },
            );
            // 删除旧部
            await Company.update(
                { _id: companyId, 'deps.id': oldDep },
                {
                    $pull: { 'deps.$.members': userId },
                },
            );
            // 新曾新部
            await Company.update(
                { _id: companyId, 'deps.id': dep },
                {
                    $push: { 'deps.$.members': userId },
                },
            );
            await Meteor.call(
                'deleteMember',
                oldgroup, userId,
            );
            await Meteor.call(
                'addGroupMembers',
                {
                    groupId,
                    newMembers: [userId],
                },
            );
        } else {
            await Company.update(
                { _id: companyId, 'members.userId': userId },
                {
                    $set: { 'members.$': member },
                },
            );
        }
    },
    /*
     退出团队/删除公司人员;
     * @param companyId(公司Id)
     * @param departmentId(部门群聊ID)
     1,公司(对应公司群聊)的members里要删除该成员
     2,该成员user数据表中对应团队的, company,groups,chatList, currentBackendCompany字段
     3,该成员所在的部门(对应部门群聊)中的Members
    */
    async deleteCompanyMember({ companyId, userId = Meteor.userId(), departmentGroupId, dep = '' }) {
        const companyInfo = Company.findOne({ _id: companyId });
        const companyGroupId = companyInfo.groupId || '';
        await Company.update(
            { _id: companyId },
            {
                $pull: { members: { userId } },
            },
        );
        await Company.update(
            { _id: companyId, 'deps.id': dep },
            {
                $pull: { 'deps.$.members': userId },
            },
        );
        if (departmentGroupId) {
            await Meteor.call(
                'deleteMember',
                departmentGroupId, userId,
            );
        }
        // 从公司大群聊中删除
        await Meteor.call(
            'deleteMember',
            companyGroupId, userId,
        );
        // 删除人员company字段中公司id
        await Meteor.users.update(
            { _id: userId },
            {
                $pull: {
                    'profile.company': companyId,
                },
            },
        );
        // 需要判断当前选中后台是否是被删除人员所在的公司ID
        const currentCompanyId = await Meteor.users.findOne({ _id: userId }).profile.currentBackendCompany;
        if (companyId === currentCompanyId) {
            await Meteor.users.update(
                { _id: Meteor.userId() },
                {
                    $unset: {
                        'profile.currentBackendCompany': '',
                    },
                },
            );
        }
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
