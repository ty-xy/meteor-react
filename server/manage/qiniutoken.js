import { Meteor } from 'meteor/meteor';
import qiniu from 'qiniu';

const accessKey = 'ptgtsBOAlMf_mihyVKf6Zbjor7JgiSs2wWM7zj4b';
const secretKey = 'ZN6cH2DawqguO-sQFL7AaDnldpvGNl6Vt7iCd9G_';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({
    scope: 'ejianlian',
    expires: 60 * 60 * 24 * 30,
});

function getToken() {
    return putPolicy.uploadToken(mac);
}

let token = getToken();
// update token
setInterval(() => {
    token = getToken();
}, 1000 * 60 * 60 * 24 * 20);

Meteor.methods({
    createToken() {
        const newCompany = {
            createdAt: new Date(),
            token,
        };
        return newCompany;
    },
});
