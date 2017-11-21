import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import feedback from '../../util/feedback';

@pureRender
class SeleteAdmin extends Component {
    static propTypes = {
        users: PropTypes.array,
        groupId: PropTypes.string,
        closeSeleteAdmin: PropTypes.func,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            selected: {},
        };
    }
    // 点击按钮,选择或取消选择
    handleToggle = (value) => {
        this.setState({
            selected: {
                [value]: !this.state.selected[value],
            },
        });
    }
    changeAdmin = () => {
        const selectedId = Object.keys(this.state.selected)[0];
        Meteor.call('changeAdmin', this.props.groupId, selectedId, (err) => {
            if (err) {
                console.error(err.reason);
            }
            this.props.closeSeleteAdmin();
            feedback.dealSuccess('设置成功');
        });
    }
    render() {
        return (
            <div className="container-wrap add-group-block selete-admin-block">
                <div className="container-middle container-content">
                    <div className="container-title">
                        群主设置
                        <Icon icon="icon-guanbi icon icon-close-addGroup icon-close" onClick={this.props.closeSeleteAdmin} />
                    </div>
                    <ul className="select-group-list">
                        {
                            this.props.users.map((item, index) => (
                                item && item.profile ?
                                    <li
                                        key={index}
                                        className="group-user-item"
                                        onClick={this.handleToggle.bind(this, item._id)}
                                    >
                                        <p className="checkbox">
                                            {
                                                this.state.selected && this.state.selected[item._id] ?
                                                    <Icon icon="icon-chuangyikongjianICON_fuzhi- icon" />
                                                    :
                                                    <Icon icon="icon-weixuanzhong icon" />

                                            }
                                        </p>
                                        <p className={this.props.users.length - 1 !== index ? 'user-info' : 'user-info user-info-last'}>
                                            <Avatar avatarColor={item.profile.avatarColor} name={item.profile.name} avatar={item.profile.avatar} />
                                            {item.profile.name}
                                        </p>
                                    </li>
                                    :
                                    <div key={index}>暂无好友</div>
                            ))
                        }
                    </ul>
                    <div>
                        <div className="confirm-btn" onClick={this.changeAdmin}>
                            确定
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default SeleteAdmin;
