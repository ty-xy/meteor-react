import React, { Component } from 'react';
import { Select, Switch } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

const Option = Select.Option;

class SystemSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
    }
    handleVerifyFriend = (value) => {
        Meteor.call('changeVerifyFriend', value, (err) => {
            console.error(err);
        });
    }
    handleHideInfo = (value) => {
        Meteor.call('changeHideInfo', value, (err) => {
            console.error(err);
        });
    }
    render() {
        const { profile = {} } = this.props.user;
        const { isHideInfo = false, verifyFriend = '0' } = profile;
        return (
            <div className="system-setting">
                <div className="system-item">好友设置</div>
                <div className="add-friend">
                    <p className="add-friend-info">加我为好友</p>
                    <Select defaultValue={verifyFriend} onChange={this.handleVerifyFriend}>
                        <Option value="0">需要好友认证</Option>
                        <Option value="1">允许任何人</Option>
                        <Option value="2">不允许任何人</Option>
                    </Select>
                </div>
                <div className="system-item">
                   信息设置
                </div>
                <div className="hide-account">
                    <p className="hide-account-info">隐藏个人信息</p>
                    <Switch defaultChecked={isHideInfo} onChange={this.handleHideInfo} />
                    {
                        isHideInfo ?
                            <p className="hide-account-tip">隐藏后仅可见您的头像和昵称</p>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}

export default withTracker(() => ({
    user: Meteor.user() || {},
}))(SystemSetting);
