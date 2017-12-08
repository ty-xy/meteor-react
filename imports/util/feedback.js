import {
    Modal,
    message,
} from 'antd';

const confirm = Modal.confirm;

const feedback = {
    // 抛出Meteor.error的错误处理
    dealError(err) {
        if (!err) {
            return;
        }
        if (err && err.reason) {
            return Modal.error({
                title: '提示',
                content: err.reason,
            });
        }
        return Modal.error({
            title: '提示',
            content: err,
        });
    },
    dealSuccess(content) {
        return Modal.success({
            title: '提示',
            content,
        });
    },
    dealDelete(title, content, func) {
        return confirm({
            title: title || 'Are you sure delete this task?',
            content,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                func();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    },
    dealWarning(content) {
        return Modal.warning({
            title: '提示',
            content,
        });
    },
    successToast(conetnt) {
        return message.success(conetnt);
    },
    // 成功后执行回调
    successToastFb(conetnt, fb) {
        return message.success(conetnt, 0.3, fb);
    },
};

export default feedback;
