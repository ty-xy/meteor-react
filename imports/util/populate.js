import { Meteor } from 'meteor/meteor';
import Files from '../schema/file';
import fields from './fields';
import Company from '../schema/company';

const PopulateUtil = {
    group(group) {
        if (group) {
            group.members = Meteor.users.find({ _id: { $in: group.members } }).fetch();
            group.admin = Meteor.users.findOne({ _id: group.admin });
        }
    },
    groups(groups) {
        groups.forEach(group => PopulateUtil.group(group));
    },
    file(file) {
        if (file) {
            return Files.findOne({ _id: file });
        }
    },
    user(user) {
        if (user) {
            return Meteor.users.findOne({ _id: user });
        }
    },
    message(messageFrom) {
        if (messageFrom) {
            return Meteor.users.findOne(
                { _id: messageFrom },
                {
                    fields: fields.user,
                },
            );
        }
    },
    company(companyId) {
        if (companyId) {
            return Company.findOne(
                { _id: companyId },
                {
                    fields: fields.companyName,
                },
            );
        }
    },
};

export default PopulateUtil;
