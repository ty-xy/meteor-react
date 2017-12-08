const phoneRe = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/;
const passwordRe = /^[a-zA-Z0-9]{6,18}$/; // 密码是6~18位数字字母组合
const passwordTipInfo = '密码由6~18位数字字母组合';


export default {
    phoneRe,
    passwordRe,
    passwordTipInfo,
};
