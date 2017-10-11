/**
 * 类似 Node.js assert
 * http://nodejs.cn/api/assert.html
 */
import { Meteor } from 'meteor/meteor';

function assert(value, error = 500, reason = 'assert fail') {
    if (!value) {
        throw new Meteor.Error(error, reason);
    }
}

export default assert;
