import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';

import AvatarSelf from '../../components/AvatarSelf';


class InfoSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowNotice: false,
            options: [{
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [{
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [{
                        value: 'xihu',
                        label: 'West Lake',
                    }],
                }],
            }, {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [{
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [{
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    }],
                }],
            }],
        };
    }
    handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (!image) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            Meteor.call('changeAvatar', this.result);
        };
        reader.readAsDataURL(image);
    }
    handleUserArea = (value) => {
        console.log(value);
    }
    render() {
        const { profile, username } = this.props.user;
        const { name } = profile;
        return (
            <ul className="info-setting">
                <li>
                    <label htmlFor="avatar">头像</label>
                    <AvatarSelf />
                    <p className="edit-avatar">修改头像
                        <input type="file" id="avatar" onChange={this.handleUploadImg} />
                    </p>
                </li>
                <li>
                    <label htmlFor="nickname">姓名</label>
                    <input type="text" id="nickname" placeholder="请您输入姓名" defaultValue={name} />
                </li>
                <li>
                    <label htmlFor="phone">手机号</label>
                    <input type="number" id="phone" value={username} disabled="true " />
                </li>
                <li>
                    <label htmlFor="signature">签名</label>
                    <input type="text" id="signature" placeholder="请您输入签名" />
                </li>
                <li>
                    <label htmlFor="sex">性别</label>
                    <select name="sex" id="sex">
                        <option value="man">男</option>
                        <option value="women">女</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="age" >年龄</label>
                    <input type="number" id="age" placeholder="请您输入年龄" />
                </li>
                <li>
                    <label htmlFor="avatar">所在地</label>
                    <Cascader options={this.state.options} placeholder="请选择地区" className="area-input" onChange={this.handleUserArea} />
                </li>
                <li>
                    <label htmlFor="company">企业</label>
                    <input type="text" id="company" />
                </li>
                <li>
                    <label htmlFor="career">职业</label>
                    <input type="职业" id="career" />
                </li>
                <li>
                    <button>保存</button>
                </li>
            </ul>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user(),
}))(InfoSetting);
