import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const File = new Mongo.Collection('files');
File.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    from: {
        type: String,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    size: {
        type: String,
    },
    url: {
        type: String,
    },
});

export default File;
