const qiniu = require('qiniu');

const accessKey = 'ptgtsBOAlMf_mihyVKf6Zbjor7JgiSs2wWM7zj4b';
const secretKey = 'ZN6cH2DawqguO-sQFL7AaDnldpvGNl6Vt7iCd9G_';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const putPolicy = new qiniu.rs.PutPolicy({ scope: 'ejianlian', expires: 60 * 60 * 24 * 30 });
const qiniuConfig = new qiniu.conf.Config();
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
        console.log('开始上传');
        formUploader.put(token, key, bytes, putExtra, (respErr, respBody, respInfo) => {
            console.log('结束上传');
            if (respErr) {
                reject(respErr);
                return;
            }
            if (!respInfo) {
                console.log(respErr, respBody, respInfo);
                reject();
                return;
            }
            if (respInfo.statusCode === 200) {
                resolve(`http://oxldjnom8.bkt.clouddn.com/${respBody.key}`);
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
