import { Modal, message } from 'antd';

const confirm = Modal.confirm;

const feedback = {
    dealError(err) {
        if (err) {
            Modal.error({
                title: '提示',
                content: err.reason,
            });
            return console.error(err.reason);
        }
    },
    dealSuccess(content) {
        Modal.success({
            title: '提示',
            content,
        });
    },
    dealDelete(title, content, func) {
        confirm({
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
        Modal.warning({
            title: '提示',
            content,
        });
    },
    successToast(conetnt) {
        message.success(conetnt);
    },
    // 成功后执行回调
    successToastFb(conetnt, fb) {
        message.success(conetnt, 1, fb);
    },
};

export default feedback;
