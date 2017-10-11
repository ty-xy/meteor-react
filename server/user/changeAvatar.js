import { Meteor } from 'meteor/meteor';
import base64 from 'base64-arraybuffer';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    changeAvatar(imageBase64) {
        imageBase64 = imageBase64.replace(/data:image\/jpeg;base64,/, '');
        const imageBytes = base64.decode(imageBase64);
        console.log(imageBytes.byteLength);
        qiniu.uploadBytes('test888.png', imageBytes).then((res) => {
            console.log(res);
        });
    },
});
