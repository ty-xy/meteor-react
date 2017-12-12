import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import InfoSetting from './InfoSetting';
import SafeSetting from './SafeSetting';
import SystemSetting from './SystemSetting';
import Icon from '../../components/Icon';

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
                { name: '资料设置', content: 'icon-ziliao' },
                { name: '安全设置', content: 'icon-anquan1' },
                { name: '系统设置', content: 'icon-xitong' },
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
                                <p className="setting-icon" style={{ backgroundColor: this.state.selected === index + 1 ? '#29B6F6' : '#ccc' }}>
                                    <Icon icon={item.content} size={20} iconColor="#fff" />
                                </p>
                                <p>{item.name}</p>
                            </li>
                        ))
                    }
                </ul>
                <div className="setting-detail-wrap">
                    {
                        this.state.selected === 1 ?
                            <InfoSetting />
                            :
                            null
                    }
                    {
                        this.state.selected === 2 ?
                            <SafeSetting />
                            :
                            null
                    }
                    {
                        this.state.selected === 3 ?
                            <SystemSetting />
                            :
                            null
                    }

                </div>
            </div>
        );
    }
}

export default AdminInfo;
