import React, { Component } from 'react';
import { Select, Switch } from 'antd';

const Option = Select.Option;

class SystemSetting extends Component {
    onChange = (checked) => {
        console.log(`switch to ${checked}`);
    }
    //     function handleChange(value) {
    //   console.log(`selected ${value}`);
    // }
    render() {
        return (
            <div className="system-setting">
                <div className="system-item">好友设置</div>
                <div className="add-friend">
                    <p className="add-friend-info">加我为好友</p>
                    <Select defaultValue="lucy">
                        <Option value="jack">需要好友认证</Option>
                        <Option value="lucy">允许任何人</Option>
                        <Option value="Yiminghe">不允许任何人</Option>
                    </Select>
                </div>
                <div className="system-item">
                   信息设置
                </div>
                <div className="hide-account">
                    <p className="hide-account-info">隐藏个人信息</p>
                    <Switch defaultChecked={false} />
                    <p className="hide-account-tip">隐藏后仅可见您的头像和昵称</p>
                </div>
            </div>
        );
    }
}

export default SystemSetting;
