import React, { Component } from 'react';
// import { Switch } from 'antd';
import { Select } from 'antd';

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
                <div>好友设置</div>
                <div>
                    <p>加我为好友</p>
                    <Select defaultValue="lucy" style={{ width: 120 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>Disabled</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                </div>
                <div>
                    <p>信息设置</p>
                </div>
                <div>
                    <p>隐藏个人信息</p>
                    <p>隐藏后仅可见您的头像和昵称</p>
                </div>
            </div>
        );
    }
}

export default SystemSetting;
