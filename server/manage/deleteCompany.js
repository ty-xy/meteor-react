import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    /*
        解散团队需要做的事情
        1,删除每个成员中对应该团队的, company,groups,chatList, currentBackendCompany字段
        2,群聊中对应的公司的groupId, subGroupIds,及对应的消息
        3,删除主管理员的对应该团队的createdCompany
        4,最后移除该团队
    */
    async deleteCompany(companyId) {
        const companyInfo = Company.findOne({
            _id: companyId,
        });
        const companyGroupId = companyInfo.groupId || '';
        const companySubGroupIds = companyInfo.subGroupIds || [];
        const allCompanyGroupIds = [companyGroupId, ...companySubGroupIds];
        const companyMainManage = companyInfo.admin;
        await companyInfo.members.map(user => (
            Meteor.users.update({
                _id: user.userId,
            }, {
                $pull: {
                    'profile.company': companyId,
                },
                $unset: {
                    'profile.currentBackendCompany': '',
                },
            })
        ));
        if (allCompanyGroupIds[0]) {
            await allCompanyGroupIds.map(groupId => (
                Meteor.call('deleteGroup', groupId, (err) => {
                    if (err) {
                        throw err;
                    }
                })
            ));
        }
        await Meteor.users.update(
            { _id: companyMainManage },
            {
                $pull: {
                    'profile.createdCompany': companyId,
                },
            },
        );
        // 在公司列表中删除
        await Company.remove({
            _id: companyId,
        });
    },
});
