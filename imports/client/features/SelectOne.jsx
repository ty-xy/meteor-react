import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Icon from '../components/Icon';
import Avatar from '../components/Avatar';

@pureRender
class SelectOne extends Component {
    static propTypes = {
        users: PropTypes.array,
        confirmChange: PropTypes.func,
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
    render() {
        return (
            <div className="select-one">
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
                <button onClick={this.props.confirmChange.bind(this, Object.keys(this.state.selected)[0])} className="confirm-btn">确定</button>
            </div>
        );
    }
}

export default withTracker(({ friendIds }) => {
    const users = friendIds.map(_id =>
        Meteor.users.findOne({ _id }),
    );
    return {
        users,
    };
})(SelectOne);
