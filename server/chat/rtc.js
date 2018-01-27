import { Meteor } from 'meteor/meteor';
import Video from '../../imports/schema/video';
import Group from '../../imports/schema/group';


Meteor.methods({
    async callVideo(groupId) {
        const group = Group.findOne({ _id: groupId }) || {};
        const members = (group.members || []).filter(_id => _id !== Meteor.userId());
        const videoMeeting = {
            createdAt: new Date(),
            from: Meteor.userId(),
            groupId,
            members,
        };
        Video.schema.validate(videoMeeting);
        const videoId = await Video.insert(videoMeeting);
        members.map(_id => (
            Meteor.users.update(
                { _id },
                {
                    $set: {
                        'profile.video': { videoId, groupId },
                    },
                },
            )
        ));
    },
    joinVideoMeeting(videoMeetingId, offerToken) {
        Video.update(
            {
                _id: videoMeetingId,
                'members.userId': Meteor.userId(),
            },
            {
                $set: {
                    'members.$.offerToken': offerToken,
                },
            },
        );
        // 返回 offerToken和socketId不为空的members
    },
    stopVideoMeeting(videoMeetingId) {
        Video.remove({
            _id: videoMeetingId,
        });
    },
});
