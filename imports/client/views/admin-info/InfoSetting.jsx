import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Avatar from '../../components/Avatar';


class InfoSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowNotice: false,
            name: '',
            username: '',
        };
    }
    componentWillMount() {
        if (this.props.user) {
            this.setState({
                name: this.props.user.profile.name,
                username: this.props.user.username,
            });
        }
    }
    handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (!image) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            console.log(this.result);
            Meteor.call('changeAvatar', this.result, 11);
        };
        reader.readAsDataURL(image);
    }
    render() {
        return (
            <ul className="info-setting">
                <li>
                    <label htmlFor="avatar">头像</label>
                    <Avatar />
                    <p className="edit-avatar">修改头像
                        <input type="file" id="avatar" onChange={this.handleUploadImg} />
                    </p>
                </li>
                <li>
                    <label htmlFor="nickname">姓名</label>
                    <input type="text" id="nickname" placeholder="请您输入姓名" value={this.state.name} />
                </li>
                <li>
                    <label htmlFor="phone">手机号</label>
                    <input type="number" id="phone" value={this.state.username} disabled="true " />
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
                    <label htmlFor="age">年龄</label>
                    <input type="number" id="age" />
                </li>
                <li>
                    <label htmlFor="avatar">所在地</label>
                    <select name="sex" id="sex">
                        <option value="man">男</option>
                        <option value="women">女</option>
                    </select>
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

export default withTracker(() => {
    Meteor.subscribe('userData');
    return {
        user: Meteor.user(),
    };
})(InfoSetting);
