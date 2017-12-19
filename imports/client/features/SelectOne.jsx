import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Radio, Button } from 'antd';

import Avatar from '../components/Avatar';

const RadioGroup = Radio.Group;
@pureRender
class SelectOne extends Component {
    static propTypes = {
        teamMembers: PropTypes.array,
        confirmChange: PropTypes.func,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            selected: {},
            value: '',
        };
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
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
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className="select-one">
                {
                    this.props.teamMembers[0] ?
                        <div>
                            <RadioGroup onChange={this.onChange} value={this.state.value}>
                                {
                                    this.props.teamMembers.map(item =>
                                        (<Radio
                                            style={radioStyle}
                                            value={item._id}
                                            key={item._id}
                                        >
                                            <p className="user-info">
                                                <Avatar avatarColor={item.profile.avatarColor} name={item.profile.name} avatar={item.profile.avatar} />
                                                {item.profile.name}
                                            </p>
                                        </Radio>),
                                    )
                                }
                                <br />
                                <div className="btn-wrap">
                                    <Button type="primary" onClick={() => this.props.confirmChange(this.state.value)}>确定</Button>
                                </div>

                            </RadioGroup>
                        </div>
                        :
                        <div>暂无好友</div>
                }
            </div>
        );
    }
}

export default withTracker(({ teamMemberIds }) => {
    const teamMembers = teamMemberIds.map(_id =>
        Meteor.users.findOne({ _id }),
    );
    return {
        teamMembers,
    };
})(SelectOne);
