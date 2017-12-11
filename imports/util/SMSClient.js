const SMSClient = require('@alicloud/sms-sdk');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAITn4gR4pbJCfu';
const secretAccessKey = 'mBNkjfQ3CHhkde68GP7w3zj7SFOPa5';
// 初始化sms_client
const smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey,
});

function createRandomCode() {
    return Math.floor(Math.random() * 900000) + 100000;
}
// 发送短信验证码
function sendSMS(PhoneNumbers, TemplateCode) {
    const currentSMSCode = createRandomCode();
    return new Promise((resolve, reject) => {
        smsClient.sendSMS(
            {
                PhoneNumbers,
                SignName: '知工网络科技',
                TemplateCode,
                TemplateParam: `{"code":${currentSMSCode},"product":"知工网络科技"}`,
            },
        ).then((res) => {
            const { Code } = res;
            if (Code === 'OK') {
            // 处理返回参数
                // console.log(res);
                resolve(res);
            }
        }, (err) => {
            // console.log(err);
            reject(err);
        });
    });
}
// 发送短信通知（邀请通知）
function sendSMSNotice(PhoneNumbers, urls, name, company, TemplateCode) {
    return new Promise((resolve, reject) => {
        smsClient.sendSMS(
            {
                PhoneNumbers,
                SignName: '知工网络科技',
                TemplateCode,
                TemplateParam: `{"urls":${urls},"product":"知工网络科技", "name":${company},"urls":${company},}`,
            },
        ).then((res) => {
            const { Code } = res;
            if (Code === 'OK') {
            // 处理返回参数
                // console.log(res);
                resolve(res);
            }
        }, (err) => {
            // console.log(err);
            reject(err);
        });
    });
}
// 查询短信
function queryDetail(PhoneNumber, BizId, SendDate) {
    return new Promise((resolve, reject) => {
        smsClient.queryDetail({
            BizId,
            PhoneNumber,
            SendDate,
            PageSize: '10',
            CurrentPage: '1',
        }).then((res) => {
            const {
                Code,
                SmsSendDetailDTOs,
            } = res;
            if (Code === 'OK') {
                // 处理发送详情内容
                // console.log(SmsSendDetailDTOs);
                resolve(SmsSendDetailDTOs);
            }
        }, (err) => {
            // 处理错误
            // console.log(err);
            reject(err);
        });
    });
}

module.exports = {
    sendSMS,
    queryDetail,
    sendSMSNotice,
};
