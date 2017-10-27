import React from 'react';
import { Icon, Radio } from 'antd';
import PropTypes from 'prop-types';

const ButtonTab = ({ handleLogChange, logType, disabledType, expand, template, moreChange }) => (
    <div className="e-mg-buttonTab">
        <p className="margin-bottom-10">选择日志模板：{disabledType}</p>
        <Radio.Group value={logType} onChange={handleLogChange}>
            {
                disabledType ? template.map((item) => {
                    if (item.name === logType) {
                        return (<Radio.Button key={item.name} value={item.name}>{item.value}</Radio.Button>);
                    }
                    return null;
                }) : template.map(item => (<Radio.Button key={item.name} value={item.name}>{item.value}</Radio.Button>))
            }
        </Radio.Group>
        {
            disabledType ? null : (
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={moreChange}>
                    更多 <Icon type={expand ? 'up' : 'down'} />
                </a>
            )
        }
    </div>
);
ButtonTab.propTypes = {
    handleLogChange: PropTypes.func,
    logType: PropTypes.string,
    expand: PropTypes.bool,
    disabledType: PropTypes.bool,
    template: PropTypes.array,
    moreChange: PropTypes.func,
};

export default ButtonTab;
