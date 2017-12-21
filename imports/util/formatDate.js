import format from 'date-format';

const formateDate = {
    renderDate(value) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (value.toLocaleDateString() === today.toLocaleDateString()) {
            return format('hh:mm', value);
        } else if (value.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return `昨天${format('hh:mm', value)}`;
        }
        return format('yyyy-MM-dd', value);
    },
    dealMessageTime(value) {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (value.toLocaleDateString() === today.toLocaleDateString()) {
            return format('hh:mm', value);
        } else if (value.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return `昨天${format('hh:mm', value)}`;
        } else if (value.getFullYear() === today.getFullYear()) {
            return format('MM-dd hh:mm', value);
        }
        return format('yyyy-MM-dd hh:mm', value);
    },
};

export default formateDate;
