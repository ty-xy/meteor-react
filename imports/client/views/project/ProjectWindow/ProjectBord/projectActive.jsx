import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
// import format from 'date-format';
import pureRender from 'pure-render-decorator';

import Avatar from '../../../../components/Avatar';
import formatDate from '../../../../../util/formatDate';
// import Task from '../../../../../../imports/schema/task';
import AvatarSelf from '../../../../components/AvatarSelf';
import Active from '../../../../../../imports/schema/active';
import feedback from '../../../../../util/feedback';

const { TextArea } = Input;
@pureRender
class ProjectMembers extends Component {
    static propTypes = {
        activities: PropTypes.arrayOf(PropTypes.object),
        Id: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            changeMark: '',
            commentMark: '',
        };
    }
    handleSendMessage = (e, func) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            func();
        }
    }
    showCreadite = (id, item) => {
        this.setState({
            [`shownCreadite${id}`]: true,
            changeMark: item,
        });
    }
    handleChangeTry=(name, e) => {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
    }
    handleRemove = (id) => {
        // this.deleteActive(id);
        feedback.dealDelete('提示', '确定要删除该评论么?', () => this.deleteActive(id));
    }
    deleteActive = (id) => {
        Meteor.call(
            'deleteActive', id, (err) => {
                console.log(err);
            },
        );
    }
    changActive = (id, value) => {
        Meteor.call(
            'changeActive', id, this.state.changeMark || value, (err) => {
                console.log(err);
            },
        );
    }
    createActive = () => {
        console.log(this.state.commentMark);
        Meteor.call(
            'createActive',
            {
                userId: Meteor.userId(),
                content: this.state.commentMark,
                taskId: this.props.Id.Id,
            },
            (err) => {
                console.log(err);
            },
        );
    }
    handleCancelCreadite=(id) => {
        this.setState({
            [`shownCreadite${id}`]: false,
        });
    }
    handleCreadite = (id, value) => {
        // console.log(this.props.id)
        this.changActive(id, value);
        this.handleCancelCreadite(id);
    }
    handleClick=(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    handleMark = () => {
        this.createActive();
        this.setState({
            commentMark: '',
        });
    }
    render() {
        console.log(Meteor.userId());
        return (
            <div className="detail-list-common detail-comment">
                <p className="comment-title">活动</p>
                <div>
                    <div style={{ display: 'flex' }}>
                        <div className="person-size">
                            <AvatarSelf />
                        </div>
                        <TextArea
                            type="text"
                            value={this.state.commentMark}
                            onKeyDown={e => this.handleSendMessage(e, this.handleMark)}
                            onChange={e => this.handleChangeTry('commentMark', e)}
                        />
                    </div>
                    <button className="comment-button" onClick={this.handleMark}>评论</button>
                </div>
                {this.props.activities.map((MarkValue) => {
                    const user = Meteor.users.findOne(MarkValue.userId);
                    console.log(user.profile);
                    return (
                        <div style={{ display: 'flex' }} className="comment-talk" key={MarkValue._id} >
                            <div className="person-size">
                                {/* <Avatar /> */}
                                <Avatar
                                    avatarColor={user.profile.avatarColor}
                                    name={user.profile.name}
                                    avatar={user.profile.avatar}
                                />
                            </div>
                            {!this.state[`shownCreadite${MarkValue._id}`] ?
                                <div >
                                    <p>{MarkValue.content}</p>
                                    <div style={{ display: 'flex' }}>
                                        <span>{formatDate.dealMessageTime(MarkValue.createTime)}</span>
                                        {MarkValue.userId === Meteor.userId() ?
                                            <div>
                                                <span>--</span>
                                                <a onClick={() => this.showCreadite(MarkValue._id, MarkValue.content)}>编辑</a>
                                                <span>--</span>
                                                <span onClick={() => this.handleRemove(MarkValue._id)} >
                                            删除
                                                </span>
                                            </div> : null}
                                    </div>
                                </div>
                                :
                                <div
                                    onClick={() => this.handleCancelCreadite(MarkValue._id)}
                                >
                                    <div className="try try-out" style={{ display: this.state[`shownCreadite${MarkValue._id}`] ? 'block' : 'none' }} />
                                    <div style={{ position: 'relative', zIndex: 1000 }}>
                                        <TextArea
                                            type="text"
                                            defaultValue={MarkValue.content}
                                            value={this.state.changeMark}
                                            autoFocus
                                            onKeyDown={e => this.handleSendMessage(e, () => this.handleCreadite(MarkValue._id, MarkValue.content))}
                                            onClick={e => this.handleClick(e)}
                                            onChange={e => this.handleChangeTry('changeMark', e)}
                                        />
                                        <button onClick={() => this.handleCreadite(MarkValue._id, MarkValue.content)}>编辑</button>
                                    </div>
                                </div>}
                        </div>
                    );
                })
                }
            </div>
        );
    }
}
export default withTracker((Id) => {
    Meteor.subscribe('active');
    Meteor.subscribe('users');
    const { profile = {} } = Meteor.user() || {};
    const { name = '', avatarColor = '', avatar = '' } = profile;
    const activities = Active.find({ taskId: Id.idIndex }, { sort: { createTime: -1 } }).fetch();
    return {
        activities,
        name,
        avatarColor,
        avatar,
    };
})(ProjectMembers);

