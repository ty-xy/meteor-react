import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const VideoMeeting = new Mongo.Collection('videoMeeting');
VideoMeeting.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    creator: {
        type: String,
    },
    members: {
        type: [Object],
    },
});

export default VideoMeeting;
