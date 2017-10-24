import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Message = new Mongo.Collection('messages');
Message.schema = new SimpleSchema({
    createdAt: {
        type: Date,
    },
    from: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    to: {
        type: String,
        regEx: /.+/,
    },
    content: {
        type: String,
    },
    // type: {
    //     type: String,
    // },
});

export default Message;
