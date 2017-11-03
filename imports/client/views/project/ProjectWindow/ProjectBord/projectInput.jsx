import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import Icon from '../../../../components/Icon';

const { TextArea } = Input;
export default function Icom({ Twidth, onClick, input, value, onChange, onConcel }) {
    return (
        <div>
            <TextArea autosize={{ minRows: 1, maxRows: 6 }} style={{ width: Twidth }} value={value} onChange={onChange} />
            <button style={{ width: '48px', height: '22px', background: '#15b4f1', borderRadius: '3px' }} onClick={onClick}>{input}</button>
            <Icon icon="icon-guanbi" onClick={onConcel} />
        </div>
    );
}
Icom.propTypes = {
    Twidth: PropTypes.number,
    onClick: PropTypes.func,
    input: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onConcel: PropTypes.func,
};
