import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const File = new Mongo.Collection('files');
File.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    size: {
        type: Number,
    },
    url: {
        type: String,
    },
});

export default File;
