import {
    Meteor,
} from 'meteor/meteor';
import format from 'date-format';

import SMSClient from '../../imports/util/SMSClient';

const registerTemplateCode = 'SMS_107415213';
const changeAccountTemplateCode = 'SMS_107415211';
const authenticationTemplateCode = 'SMS_107415217';
const changePasswordTemplateCode = 'SMS_107415212';
// const testTemplateCode = 'SMS_107415216';
Meteor.methods({
    sendRegisterSMS(PhoneNumber) {
        return new Promise((resolve, reject) => {
            SMSClient.sendSMS(PhoneNumber, registerTemplateCode).then((reponse) => {
                resolve(reponse);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    changeAccountSMS(PhoneNumber) {
        SMSClient.sendSMS(PhoneNumber, changeAccountTemplateCode);
    },
    authenticationSMS(PhoneNumber) {
        SMSClient.sendSMS(PhoneNumber, authenticationTemplateCode);
    },
    changePasswordSMS(PhoneNumber) {
        SMSClient.sendSMS(PhoneNumber, changePasswordTemplateCode);
    },
    queryDetail(PhoneNumber, BizId, SMSCode) {
        return new Promise((resolve, reject) => {
            SMSClient.queryDetail(PhoneNumber, BizId, format('yyyyMMdd', new Date())).then((response) => {
                const SMSVerificationResult = response.SmsSendDetailDTO[0].Content.indexOf(SMSCode) !== -1;
                resolve(SMSVerificationResult);
            }).catch((err) => {
                reject(err);
            });
        });
    },
});
