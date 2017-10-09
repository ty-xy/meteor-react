import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import InfoSetting from './InfoSetting';
import SafeSetting from './SafeSetting';
import SystemSetting from './SystemSetting';

@pureRender
class AdminInfo extends Component {
    static propTypes = {
        goto: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            selected: 1,
            settingNav: [
                { name: '资料设置', content: 'iconInfo' },
                { name: '安全设置', content: 'iconSafe' },
                { name: '系统设置', content: 'iconSystem' },
            ],
        };
    }
    clickTab = (path) => {
        this.props.goto(path);
    }
    handleClick = (index) => {
        this.setState({ selected: index });
    }
    render() {
        return (
            <div className="admin-info">
                <ul className="setting-wrap">
                    {
                        this.state.settingNav.map((item, index) => (
                            <li
                                key={index}
                                className="setting"
                                style={{ color: this.state.selected === index + 1 ? '#29B6F6' : '#333' }}
                                onClick={this.handleClick.bind(this, index + 1)}
                            >
                                <p className="setting-icon">
                                    <i className={item.content} />
                                    {/* <i className="icon icon-message icon-type-logo">{item.content}</i> */}
                                </p>
                                <p>{item.name}</p>
                            </li>
                        ))
                    }
                </ul>
                <div className="setting-detail-wrap">
                    <InfoSetting style={{ display: this.state.selected === 1 ? 'block' : 'none' }} />
                    <SafeSetting style={{ display: this.state.selected === 2 ? 'block' : 'none' }} />
                    <SystemSetting style={{ display: this.state.selected === 3 ? 'block' : 'none' }} />
                </div>
            </div>
        );
    }
}

export default AdminInfo;
