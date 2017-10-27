import { Meteor } from 'meteor/meteor';
import Group from '../../imports/schema/group';

Meteor.methods({
    editGroupNotice(groupId, notice) {
        Group.update(
            { _id: groupId },
            {
                $set: {
                    notice,
                    noticeTime: new Date(),
                },
            },
        );
    },
});
