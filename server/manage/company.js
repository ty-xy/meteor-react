import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';
import Group from '../../imports/schema/group';
import SMSClient from '../../imports/util/SMSClient';
import avatarUrl from '../../imports/util/avatarUrl';
import UserUtil from '../../imports/util/user';
import qiniu from '../../imports/util/qiniu';

const avatarTeam = avatarUrl.avatarTeam;


Meteor.methods({
    // 创建公司/团队 必传字段: name,industryType
    async createCompany({ name, industryType, residence = [], logo = avatarTeam, members = [] }) {
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
    changeCompanyInfo(companyId, { name, industryType, residence, logo = avatarTeam }) {
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
    changeCompanyInfoImg(imageBase64, _id) {
        const imgType = imageBase64.substring(imageBase64.indexOf('/') + 1, imageBase64.lastIndexOf(';'));
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        qiniu.uploadBytes(`avatar_${_id}_${Date.now()}.${imgType}`, imageBinary)
            .then(Meteor.bindEnvironment(logo => Company.update(
                { _id },
                {
                    $set: {
                        logo,
                    },
                },
            )));
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
    editCompanyDep({ companyId, name, id, isAutoChat, admin, groupId }) {
        Company.update(
            { _id: companyId, 'deps.id': id },
            {
                $set: { 'deps.$.name': name, 'deps.$.admin': admin },
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
                    Meteor.call(
                        'changeAdmin',
                        groupId, admin,
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
        let name = '';
        const company = Company.findOne({ _id: companyId }) || {};
        (company.deps || []).forEach((item) => {
            if (item.id === _users[0].dep) {
                name = item.name;
            }
        });
        if (!groupId) {
            Meteor.call(
                'createGroup',
                { name, members: [], type: 'team', admin: _users[0].userId, superiorId: companyId },
                (err, groupid) => {
                    if (err) {
                        console.error(err);
                    }
                    groupId = groupid;
                    Company.update(
                        { _id: companyId, 'deps.id': _users[0].dep },
                        {
                            $set: { 'deps.$.groupId': groupId },
                            $push: {
                                subGroupIds: groupId,
                            },
                        },
                    );
                },
            );
        }
        _users.forEach((item) => {
            Company.update(
                { _id: companyId, 'members.userId': item.userId },
                {
                    $set: { 'members.$': item },
                },
                (err, res) => {
                    if (res && item.dep) {
                        // 删除旧部中的userid
                        Company.update(
                            { _id: companyId, 'deps.id': oldDep },
                            {
                                $pull: { 'deps.$.members': item.userId },
                            },
                        );
                        // 移除群聊中的人
                        Meteor.call(
                            'deleteMember',
                            oldgroup,
                            item.userId,
                            companyId,
                        );
                        // 添加到新的群聊
                        Meteor.call(
                            'addGroupMembers',
                            {
                                groupId,
                                newMemberIds: [item.userId],
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
    async addMember({ companyId = UserUtil.getCurrentBackendCompany(), userId, dep = '', departmentGroupId, pos, companyGroupId }) {
        console.log('addMember', companyId, dep, userId, departmentGroupId, pos, companyGroupId);
        const member = {
            userId,
            dep,
            pos,
        };

        const company = Company.findOne({ _id: companyId }) || {};
        const { members = [], deps = [] } = company;
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
                membersNum = (item.members && item.members.length) || 0;
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
            const userInfo = Meteor.users.findOne({ _id: userId });
            if (userInfo && userInfo.profile && !userInfo.profile.mainCompany) {
                Meteor.users.update(
                    { _id: userId },
                    {
                        $push: {
                            'profile.company': companyId,
                        },
                        $set: {
                            'profile.mainCompany': companyId,
                        },
                    },
                );
            } else {
                Meteor.users.update(
                    { _id: userId },
                    {
                        $push: {
                            'profile.company': companyId,
                        },
                    },
                );
            }
        }

        return Company.findOne({ _id: companyId }) ? Company.findOne({ _id: companyId }).name : '邀请出错';
    },
    // 修改人员
    async editMember({ companyId = UserUtil.getCurrentBackendCompany(), userId, dep = '', oldDep, groupId, oldgroup, pos }) {
        const member = {
            userId,
            dep,
            pos,
        };
        // 删除旧部
        await Company.update(
            { _id: companyId, 'deps.id': oldDep },
            {
                $pull: { 'deps.$.members': userId },
            },
        );
        // 判断是否选择部门
        if (dep) {
            await Company.update(
                { _id: companyId, 'members.userId': userId },
                {
                    $set: { 'members.$': member },
                },
            );
            // 添加到目标
            await Company.update(
                { _id: companyId, 'deps.id': dep },
                {
                    $push: { 'deps.$.members': userId },
                },
            );

            // 删除之前群聊
            await Meteor.call(
                'deleteMember',
                oldgroup, userId, companyId,
            );
            if (!groupId) {
                // 新增群聊
                let name = '';
                const company = Company.findOne({ _id: companyId }) || {};
                (company.deps || []).forEach((item) => {
                    if (item.id === dep) {
                        name = item.name;
                    }
                });
                Meteor.call(
                    'createGroup',
                    { name, members: [userId], type: 'team', admin: userId, superiorId: companyId },
                    (err, groupid) => {
                        if (err) {
                            console.error(err);
                            return false;
                        }
                        Company.update(
                            { _id: companyId, 'deps.id': dep },
                            {
                                $set: { 'deps.$.groupId': groupid },
                                $push: {
                                    subGroupIds: groupid,
                                },
                            },
                        );
                        Company.update(
                            { _id: companyId, 'deps.id': oldDep },
                            {
                                $set: { 'deps.$.groupId': '' },
                                $pull: {
                                    subGroupIds: groupId,
                                },
                            },
                        );
                    },
                );
            } else {
                // 添加到移入的群聊
                await Meteor.call(
                    'addGroupMembers',
                    {
                        groupId,
                        newMemberIds: [userId],
                    },
                );
            }
        } else {
            // 删除之前群聊
            await Meteor.call(
                'deleteMember',
                oldgroup, userId, companyId,
            );
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
        // 如果删除的是部门主管， 则admin值空
        companyInfo.deps.forEach((item) => {
            if (item.admin === userId) {
                Company.update(
                    { _id: companyId, 'deps.id': dep },
                    {
                        $set: { 'deps.$.admin': '' },
                    },
                );
            }
        });


        await Company.update(
            { _id: companyId, 'deps.id': dep },
            {
                $pull: { 'deps.$.members': userId },
            },
        );
        if (departmentGroupId) {
            await Meteor.call(
                'deleteMember',
                departmentGroupId, userId, companyId,
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
