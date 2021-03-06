import {
    Meteor,
} from 'meteor/meteor';

import Files from '../../imports/schema/file';
import qiniu from '../../imports/util/qiniu';
import assert from '../../imports/util/assert';

Meteor.methods({
    insertFile(name, type, size, fileBase64) {
        // console.log(fileBase64);
        assert(size < 100 * 1024 * 1024, 400, '只能发送小于100M的文件');
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
        const fileBase64Key = fileBase64.replace(/data:[a-z]+\/([a-z]+);base64,/, '');
        const imageBinary = Buffer.from(fileBase64Key, 'base64');
        return new Promise((resolve) => {
            const newFile = {
                createdAt: new Date(),
                from: Meteor.userId(),
                name,
                type,
                size: fileSize,
                url: '',
            };
            Files.schema.validate(newFile);
            const fileId = Files.insert(newFile);
            resolve(fileId);
            qiniu.uploadBytes(`file_${Date.now()}_${name}`, imageBinary)
                .then(Meteor.bindEnvironment((imageKey) => {
                    Files.update(
                        { _id: fileId },
                        {
                            $set: {
                                url: imageKey,
                            },
                        },

                    );
                    // const newFile = {
                    //     createdAt: new Date(),
                    //     from: Meteor.userId(),
                    //     name,
                    //     type,
                    //     size: fileSize,
                    //     url: imageKey,
                    // };
                    // Files.schema.validate(newFile);
                    // const fileId = Files.insert(newFile);
                    // resolve(fileId);
                }),
                );
        });
    },
    clientInsertFile(name, type, size, url) {
        const newFile = {
            createdAt: new Date(),
            from: Meteor.userId(),
            name,
            type,
            size,
            url,
        };
        Files.schema.validate(newFile);
        const fileId = Files.insert(newFile);
        return fileId;
    },
});
