import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const video = new Mongo.Collection('video');
video.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    from: {
        type: String,
    },
    groupId: {
        type: String,
    },
    members: {
        type: [String],
    },
});

export default video;
