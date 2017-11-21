import {
    Meteor,
} from 'meteor/meteor';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    // 上传图片,返回图片url
    uploadImg(imageBase64) {
        const imgType = imageBase64.substring(imageBase64.indexOf('/') + 1, imageBase64.lastIndexOf(';'));
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        return new Promise((resolve) => {
            qiniu.uploadBytes(`avatar_${Date.now()}.${imgType}`, imageBinary)
                .then(Meteor.bindEnvironment(imageKey => resolve(imageKey)));
        });
    },
});
