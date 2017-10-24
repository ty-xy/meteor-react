import React from 'react';
import { Icon, Radio } from 'antd';
import PropTypes from 'prop-types';

const ButtonTab = ({ handleLogChange, logType, expand, template, moreChange }) => (
    <div className="e-mg-buttonTab">
        <p className="margin-bottom-10">选择日志模板：</p>
        <Radio.Group value={logType} onChange={handleLogChange}>
            {
                template.map(item => <Radio.Button key={item.name} value={item.name}>{item.value}</Radio.Button>)
            }
        </Radio.Group>
        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={moreChange}>
            更多 <Icon type={expand ? 'up' : 'down'} />
        </a>
    </div>
);
ButtonTab.propTypes = {
    handleLogChange: PropTypes.func,
    logType: PropTypes.string,
    expand: PropTypes.bool,
    template: PropTypes.array,
    moreChange: PropTypes.func,
};

export default ButtonTab;
