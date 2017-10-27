import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import Icon from '../../../../components/Icon';

const { TextArea } = Input;
export default function Icom({ Twidth, onClick, input }) {
    return (
        <div>
            <TextArea autosize style={{ width: Twidth }} />
            <button style={{ width: '48px', height: '22px', background: '#15b4f1', borderRadius: '3px' }} onClick={onClick}>{input}</button>
            <Icon icon="icon-guanbi" />
        </div>
    );
}
Icom.propTypes = {
    Twidth: PropTypes.number,
    onClick: PropTypes.func,
    input: PropTypes.string,
};

