import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Cascader, Select } from 'antd';

import AvatarSelf from '../../components/AvatarSelf';
import feedback from '../../../util/feedback';

const Option = Select.Option;

class InfoSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowNotice: false,
            sex: 'male',
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

        const { _id = '' } = this.props.user;

        reader.onloadend = function () {
            Meteor.call('changeAvatar', this.result, _id, (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                console.log('修改头像成功');
            });
        };
        reader.readAsDataURL(image);
    }
    handleUserArea = (value) => {
        console.log(value);
    }
    handleUserSex = (value) => {
        this.setState({
            sex: value,
        });
    }
    handleSaveInfo = () => {
        if (!this.$username.value) {
            feedback.dealError('姓名不能为空');
            return;
        }
        Meteor.call('changeUserBaseInfo', this.$username.value, this.$signature.value, this.state.sex, this.$age.value, (err) => {
            console.log(err);
            feedback.dealSuccess('修改成功');
        });
    }
    render() {
        const { profile = {}, username = '' } = this.props.user;
        const { name = '', company = [], signature = '', age = '', sex = '' } = profile;
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
                    <input type="text" id="nickname" placeholder="请您输入姓名" defaultValue={name} ref={i => this.$username = i} />
                </li>
                <li>
                    <label htmlFor="phone">手机号</label>
                    <input type="number" id="phone" value={username} disabled="true " style={{ border: 0 }} />
                </li>
                <li>
                    <label htmlFor="signature">签名</label>
                    <input type="text" id="signature" placeholder="请您输入签名" defaultValue={signature} ref={i => this.$signature = i} />
                </li>
                <li>
                    <label htmlFor="sex">性别</label>
                    <Select defaultValue={sex} onChange={this.handleUserSex} style={{ width: 255 }}>
                        <Option value="male" style={{ width: 255 }}>男</Option>
                        <Option value="female" style={{ width: 255 }}>女</Option>
                    </Select>
                </li>
                <li>
                    <label htmlFor="age" >年龄</label>
                    <input type="number" id="age" placeholder="请您输入年龄" min={0} max={200} ref={i => this.$age = i} defaultValue={age} />
                </li>
                <li>
                    <label htmlFor="avatar">所在地</label>
                    <Cascader options={this.state.options} placeholder="请选择地区" className="area-input" onChange={this.handleUserArea} />
                </li>
                {
                    company.length > 0 ?
                        <div>
                            <li>
                                <label htmlFor="company">企业</label>
                                <input type="text" id="company" disabled="true " style={{ border: 0 }} />
                            </li>
                            <li>
                                <label htmlFor="career">职业</label>
                                <input type="职业" id="career" disabled="true " style={{ border: 0 }} />
                            </li>
                        </div>
                        :
                        null
                }
                <li>
                    <button onClick={this.handleSaveInfo}>保存</button>
                </li>
            </ul>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user() || {},
}))(InfoSetting);
