import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Avatar from './Avatar';

export default withTracker(() => {
    const { profile = {} } = Meteor.user() || {};
    const { name = '', avatarColor = '', avatar = '' } = profile;
    return {
        name,
        avatarColor,
        avatar,
    };
})(Avatar);
