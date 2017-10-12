import { Meteor } from 'meteor/meteor';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    changeAvatar(imageBase64) {
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        qiniu.uploadBytes('test888.png', imageBinary).then((res) => {
            console.log(res);
        });
    },
});
