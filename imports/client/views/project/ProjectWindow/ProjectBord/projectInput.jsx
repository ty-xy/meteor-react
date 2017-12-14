import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import Icon from '../../../../components/Icon';

const { TextArea } = Input;
export default function Icom({ Twidth, onClick, input, value, onChange, onConcel, onPop, onKeyDown, defaultvalue,
    bool = true, Top }) {
    return (
        <div style={{ zIndex: 2000, position: 'relative', marginTop: Top }}>
            <TextArea
                autosize={{ minRows: 1, maxRows: 6 }}
                autoFocus
                style={{ width: Twidth }}
                defaultValue={defaultvalue}
                value={value}
                onChange={onChange}
                onClick={onPop}
                onKeyDown={onKeyDown}
            />
            <button
                className="input-button"
                onClick={onClick}
            >{input}</button>
            {bool ?
                <Icon icon="icon-guanbi" onClick={onConcel} size={16} /> : null}
        </div>
    );
}
Icom.propTypes = {
    onKeyDown: PropTypes.func,
    onPop: PropTypes.func,
    Top: PropTypes.number,
    bool: PropTypes.bool,
    Twidth: PropTypes.number,
    onClick: PropTypes.func,
    input: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onConcel: PropTypes.func,
    defaultvalue: PropTypes.string,
};
