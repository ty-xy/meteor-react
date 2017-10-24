import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Company = new Mongo.Collection('company');
Company.schema = new SimpleSchema({
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    avatar: {
        type: String,
    },
});

export default Company;
