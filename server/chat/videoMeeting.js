import { Meteor } from 'meteor/meteor';
import VideoMeeting from '../../imports/schema/videoMeeting';

Meteor.methods({
    startVideoMeeting(members, offerToken, socketId) {
        members = members.map(userId => ({
            userId,
            offerToken: userId === Meteor.userId() ? offerToken : null,
            socketId: userId === Meteor.userId() ? socketId : null,
        }));
        const videoMeeting = {
            createdAt: new Date(),
            creator: Meteor.userId(),
            members,
        };
        VideoMeeting.schema.validate(videoMeeting);
        return VideoMeeting.insert(videoMeeting);
    },
    joinVideoMeeting(videoMeetingId, offerToken) {
        VideoMeeting.update(
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
        VideoMeeting.remove({
            _id: videoMeetingId,
        });
    },
});
