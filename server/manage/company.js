import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';
import Group from '../../imports/schema/group';
import SMSClient from '../../imports/util/SMSClient';
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
        // 是我创建的需要在createdCompany
        Meteor.users.update(
            { _id: Meteor.userId() },
            {
                $push: {
                    'profile.createdCompany': companyId,
                },
            },
        );
        // 每个成员的company里添加
        members.map(member => (
            Meteor.users.update(
                { _id: member.userId },
                {
                    $push: {
                        'profile.company': companyId,
                    },
                },
            )
        ));
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
    addDepartment({ _id, id, name, isAutoChat, admin = '', avatar = '' }) {
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
    batchSetDep({ companyId, _users, groupId, oldgroup, oldDep }) {
        console.log('oldDep', oldDep);
        _users.forEach((item) => {
            Company.update(
                { _id: companyId, 'members.userId': item.userId },
                {
                    $set: { 'members.$': item },
                },
                (err, res) => {
                    if (res && item.dep) {
                        console.log('deleteMember', oldgroup, item.userId);
                        Meteor.call(
                            'deleteMember',
                            oldgroup,
                            item.userId,
                        );
                        Meteor.call(
                            'addGroupMembers',
                            {
                                groupId,
                                newMemberIds: [item.userId],
                            },
                        );
                        // 删除旧部中的userid
                        Company.update(
                            { _id: companyId, 'deps.id': oldDep },
                            {
                                $pull: { 'deps.$.members': item.userId },
                            },
                        );
                        // 更新修改后的部门的 userID
                        Company.update(
                            { _id: companyId, 'deps.id': item.dep },
                            {
                                $push: { 'deps.$.members': item.userId },
                            },
                        );
                    }
                },
            );
        });
    },
    // 公司添加人员
    async addMember({ companyId, userId, dep = '', departmentGroupId, pos, companyGroupId }) {
        console.log('addMember', companyId, userId, departmentGroupId, pos, companyGroupId);
        const member = {
            userId,
            dep,
            pos,
        };

        const company = Company.findOne({ _id: companyId }) || {};
        const { members = [], deps } = company;
        const res = {};

        (members || []).forEach((item) => {
            if (item.userId === userId) {
                res.done = '你已存在该团队中';
            }
        });
        if (res.done) {
            return res;
        }

        /*
            membersNum： 部门人数决定是默认和创建群聊
            name: 生成群聊的名称
            isAutoChat：是否创建群聊
            如果部门人数为空， 默认添加的第一个人为群聊的群主
        */
        let membersNum = 0;
        let name = '';
        let isAutoChat = false;
        deps.forEach((item) => {
            if (item.id === dep) {
                name = item.name;
                membersNum = item.members.length;
                isAutoChat = item.isAutoChat;
            }
        });

        // 更新部门人员
        const pro = () => new Promise((resolve, reject) => {
            Company.update(
                { _id: companyId },
                {
                    $push: { members: member },
                },
                (err, r) => (err ? reject(0) : resolve(r)));
        });
        const rr = await pro();
        if (rr) {
            if (dep) {
                // 更新部门人员
                Company.update(
                    { _id: companyId, 'deps.id': dep },
                    {
                        $push: { 'deps.$.members': userId },
                    },
                );
                // 如果允许创建允许、部门人员为空和群聊不存在, 则创建部门对应的群聊
                // console.log(membersNum, isAutoChat, departmentGroupId);
                if (!membersNum && isAutoChat && !departmentGroupId) {
                    Meteor.call(
                        'createGroup',
                        { name, members: [userId], type: 'team', admin: userId, superiorId: companyId },
                        (err, groupId) => {
                            if (err) {
                                console.error(err);
                            }
                            Company.update(
                                { _id: companyId, 'deps.id': dep },
                                {
                                    $set: { 'deps.$.groupId': groupId },
                                    $push: {
                                        subGroupIds: groupId,
                                    },
                                },
                            );
                        },
                    );
                } else if (!membersNum && isAutoChat && departmentGroupId) {
                    // 部门成员全部被删除后重新添加成员时
                    Meteor.call(
                        'addGroupMembers',
                        {
                            groupId: departmentGroupId,
                            newMemberIds: [userId],
                        },
                    );
                    Group.update(
                        { _id: departmentGroupId },
                        {
                            $set: {
                                admin: userId,
                            },
                        },
                    );
                } else if (membersNum && isAutoChat && departmentGroupId) {
                    Meteor.call(
                        'addGroupMembers',
                        {
                            groupId: departmentGroupId,
                            newMemberIds: [userId],
                        },
                    );
                }
            }
            // 加入公司大群聊
            Meteor.call(
                'addGroupMembers',
                {
                    groupId: companyGroupId,
                    newMemberIds: [userId],
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
            // 删除之前群聊
            await Meteor.call(
                'deleteMember',
                oldgroup, userId,
            );
            // 添加到移入的群聊
            await Meteor.call(
                'addGroupMembers',
                {
                    groupId,
                    newMemberIds: [userId],
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
                { _id: userId },
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
    // 邀请员工
    // sendSMS
    inviteMembers(phoneNumber, urls, name, company) {
        return new Promise((resolve, reject) => {
            SMSClient.sendSMSNotice(phoneNumber, urls, name, company, 'SMS_116590607').then((reponse) => {
                resolve(reponse);
            }).catch((err) => {
                reject(err);
            });
        });
    },
});
