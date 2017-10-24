import { Meteor } from 'meteor/meteor';

import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    sendFile(imageBase64, _id) {
        const imgType = imageBase64.substring(imageBase64.indexOf('/') + 1, imageBase64.lastIndexOf(';'));
        console.log(imgType, _id);
        imageBase64 = imageBase64.replace(/data:image\/(jpeg|jpg|png|gif);base64,/, '');
        const imageBinary = Buffer.from(imageBase64, 'base64');
        qiniu.uploadBytes(`file_${_id}_${Date.now()}.${imgType}`, imageBinary)
            .then(Meteor.bindEnvironment((imageKey) => {
                console.log(imageKey);
            },
            ));
    },
});
