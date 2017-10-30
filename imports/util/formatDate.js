import format from 'date-format';

const formateDate = {
    dealTime(value) {
        const disTime = (new Date()).getTime() - value.getTime();
        if (disTime < 24 * 60 * 60 * 1000) {
            return format('hh:mm', value);
        } else if (disTime < 24 * 60 * 60 * 1000 * 2) {
            return `昨天${format('hh:mm', value)}`;
        }
        return format('yyyy-MM-dd', value);
    },
    dealMessageTime(value) {
        const disTime = (new Date()).getTime() - value.getTime();
        if (disTime < 24 * 60 * 60 * 1000) {
            return format('hh:mm', value);
        } else if (disTime < 24 * 60 * 60 * 1000 * 2) {
            return `昨天${format('hh:mm', value)}`;
        }
        return format('yyyy-MM-dd hh:mm', value);
    },
};

export default formateDate;
