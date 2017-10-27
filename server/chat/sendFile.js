import {
    Meteor,
} from 'meteor/meteor';

import Files from '../../imports/schema/file';
import qiniu from '../../imports/util/qiniu';

Meteor.methods({
    insertFile(name, type, size, fileBase64) {
        let unit = 'B';
        if (size > 1024) {
            size /= 1024;
            unit = 'KB';
        }
        if (size > 1024) {
            size /= 1024;
            unit = 'MB';
        }
        const fileSize = `${size.toFixed(2)}${unit}`;
        fileBase64 = fileBase64.replace(/data:image\/(jpeg|jpg|png|gif|zip|rar);base64,/, '');
        const imageBinary = Buffer.from(fileBase64, 'base64');
        return new Promise((resolve) => {
            qiniu.uploadBytes(`file_${Date.now()}_${name}`, imageBinary)
                .then(Meteor.bindEnvironment((imageKey) => {
                    const newFile = {
                        createdAt: new Date(),
                        from: Meteor.userId(),
                        name,
                        type,
                        size: fileSize,
                        url: imageKey,
                    };
                    Files.schema.validate(newFile);
                    const fileId = Files.insert(newFile);
                    resolve(fileId);
                }),
                );
        });
    },
});
