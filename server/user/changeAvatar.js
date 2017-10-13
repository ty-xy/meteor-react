import { Meteor } from 'meteor/meteor';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    changeAvatar(imageBase64, _id) {
        const imgType = imageBase64.substring(imageBase64.indexOf('/') + 1, imageBase64.lastIndexOf(';'));
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        qiniu.uploadBytes(`avatar${_id}${Date.now()}.${imgType}`, imageBinary).then((res) => {
            console.log(res);
        });
    },
});
