import { Meteor } from 'meteor/meteor';
import Files from '../schema/file';

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
};

export default PopulateUtil;
