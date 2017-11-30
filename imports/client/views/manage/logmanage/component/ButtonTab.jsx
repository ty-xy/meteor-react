import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ButtonTab = ({ disabledType, expand, template, moreChange, location, choooseCachelog }) => (
    <div className="e-mg-buttonTab margin-top-20">
        <p className="margin-bottom-10">选择日志模板：{disabledType}</p>
        {
            disabledType ? template.map((item) => {
                const state = choooseCachelog(item.name);
                if (state._id) {
                    state.handleTab = true;
                }
                if (item.name === (location.state && location.state.type)) {
                    return (<Link
                        key={item.name}
                        className="margin-right-20 e-mg-log-button-tab e-mg-log-button-tab-active"
                        to={{ pathname: item.url, state }}
                        disabled
                        style={{ color: '#fff' }}
                    >
                        {item.name}
                    </Link>);
                }
                return null;
            }) : template.map((item) => {
                const state = choooseCachelog(item.name);
                if (state._id) {
                    state.handleTab = true;
                }
                return (<Link
                    className={location.pathname !== item.url ? 'margin-right-20 e-mg-log-button-tab' : 'margin-right-20 e-mg-log-button-tab e-mg-log-button-tab-active'}
                    key={item.name}
                    to={{ pathname: item.url, state }}
                >
                    {item.name}
                </Link>);
            })
        }
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
    location: PropTypes.object,
    // logType: PropTypes.string,
    expand: PropTypes.bool,
    disabledType: PropTypes.bool,
    template: PropTypes.array,
    moreChange: PropTypes.func,
    choooseCachelog: PropTypes.func,
};

export default ButtonTab;
