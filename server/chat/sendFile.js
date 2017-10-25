import { Meteor } from 'meteor/meteor';

import Files from '../../imports/schema/file';

Meteor.methods({
    insertFile(name, type, size) {
        const newFile = {
            createdAt: new Date(),
            name,
            type,
            size,
            url: '',
        };
        Files.schema.validate(newFile);
        return Files.insert(newFile);
    },
});
