import qiniu from 'qiniu';

const accessKey = 'ptgtsBOAlMf_mihyVKf6Zbjor7JgiSs2wWM7zj4b';
const secretKey = 'ZN6cH2DawqguO-sQFL7AaDnldpvGNl6Vt7iCd9G_';
const domain = 'http://cdn.zg18.com/';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({
    scope: 'ejianlian',
    expires: 60 * 60 * 24 * 30,
});

const qiniuConfig = new qiniu.conf.Config();
qiniuConfig.zone = qiniu.zone.Zone_z1;

const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
const putExtra = new qiniu.form_up.PutExtra();

function getToken() {
    return putPolicy.uploadToken(mac);
}

let token = getToken();
// update token
setInterval(() => {
    token = getToken();
}, 1000 * 60 * 60 * 24 * 20);

function uploadBytes(key, bytes) {
    return new Promise((resolve, reject) => {
        formUploader.put(token, key, bytes, putExtra, (respErr, respBody, respInfo) => {
            if (respErr) {
                return reject(respErr);
            }
            if (!respInfo) {
                console.log(respErr, respBody, respInfo);
                return reject();
            }
            if (respInfo.statusCode === 200) {
                resolve(domain + respBody.key);
            } else {
                reject({
                    code: respInfo.statusCode,
                    body: respBody,
                });
            }
        });
    });
}

module.exports = {
    uploadBytes,
};
