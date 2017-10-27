import { Meteor } from 'meteor/meteor';

import Company from '../../imports/schema/company';

Meteor.methods({
    createCompany({ name, id }) {
        const newCompany = {
            createdAt: new Date(),
            name,
            avatar: '',
            id,
        };
        Company.schema.validate(newCompany);
        Company.insert(newCompany);
    },
});
