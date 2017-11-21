const SMSClient = require('@alicloud/sms-sdk');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId';
const secretAccessKey = 'yourAccessKeySecret';
// 初始化sms_client
const smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey,
});
// 发送短信
smsClient.sendSMS({
    PhoneNumbers: '1500000000',
    SignName: '云通信产品',
    TemplateCode: 'SMS_000000',
    TemplateParam: '{"code":"12345","product":"云通信"}',
}).then((res) => {
    const {
        Code,
    } = res;
    if (Code === 'OK') {
        // 处理返回参数
        console.log(res);
    }
}, (err) => {
    console.log(err);
});
