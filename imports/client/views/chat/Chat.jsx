import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'antd';


import ContactList from './chatSideLeft/ContactList';
import FriendsList from './chatSideLeft/FriendsList';
import GroupList from './chatSideLeft/GroupList';
import TeamList from './chatSideLeft/TeamList';
import AddChat from '../chat/chatSideLeft/addChat/AddChat';
import ChatWindow from './chatWindow/ChatWindow';
import UserUtil from '../../../util/user';
import feedback from '../../../util/feedback';

import NewFriend from './chatWindow/NewFriend';
import SearchChat from '../../features/SearchChat';
// import ProjectNotice from './chatWindow/ProjectNotice';

import TeamMembers from './chatSideLeft/TeamMembers';
import EmptyChat from '../../components/EmptyChat';


import InviteModel from '../manage/audit/component/MyModel';

@pureRender
class Chat extends Component {
    static propTypes = {
        chatList: PropTypes.array,
        history: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            selected: 1,
            selectedLinkMan: 1,
            chatSideNav: [
                { name: '消息', content: 'icon-xiaoxi' },
                { name: '联系人', content: 'icon-group' },
                { name: '团队', content: 'icon-qunzu' },
            ],
            linkManNav: [
                { name: '好友', content: 'icon-group' },
                { name: '群组', content: 'icon-qunzu' },
            ],
            to: '',
            userId: '',
            selectedChat: {},
            chatType: 'message',
            currentKey: '',
            currentDeps: '',
            deps: '',
            // inviteModel: true,
        };
    }
    componentWillMount() {
        const { history } = this.props;
        if (history.location.search && history.location.state === 'invite') {
            const search = location.search.slice(1).split('&');
            const searchs = {};
            search.forEach((item) => {
                searchs[item.split('=')[0]] = item.split('=')[1];
            });
            if (searchs.companyId) {
                const { companyId, groupId, dep } = searchs;
                Meteor.call(
                    'addMember',
                    { companyId, userId: Meteor.userId(), name: UserUtil.getName(), dep, groupId, pos: '', invite: true },
                    (e, r) => {
                        if (e) {
                            feedback.dealError('添加失败');
                            return false;
                        }
                        this.props.history.replace({ pathname: '/chat' });
                        if (r.done) {
                            feedback.dealSuccess(r.done);
                        } else {
                            this.setState({ inviteModel: true, inviteModelName: r });
                        }
                    },
                );
            }
        }
    }
    handleChatType = (chatType) => {
        // console.log(2222, chatType);
        this.setState({
            chatType,
        });
    }
    handleTeamMembers = (chatType, currentKey, currentDeps = '', deps = '') => {
        this.setState({
            currentKey,
            currentDeps,
            deps,
        });
        this.handleChatType(chatType);
    }
    handleClick = (index) => {
        this.setState({
            selected: index,
        });
    }
    handleLinkManNav = (index) => {
        this.setState({
            selectedLinkMan: index,
        });
    }
    // 跳转到那个类型: to: 跳到那个, userId: userId/groupId, type: 'userId'/'groupId',chatType: 'message'/'newFriend'/'teamMembers'/'workNotice'/'projectNotice'
    changeTo = (to, userId, type, chatType) => {
        // 有未读消息(有用户所在的群以及发给用户的消息)且不在聊天列表时,创建新的聊天窗口
        if (type && !this.props.chatList.find(item => item[type] === userId)) {
            Meteor.call('addChatList', userId, type, (err) => {
                feedback.dealError(err);
            });
        }
        this.handleToggle(userId);
        this.setState({ to, userId, chatType });
    }
    handleToggle = (value) => {
        this.setState({
            selectedChat: {
                [value]: true,
            },
        });
    }
    // 邀请提示
    hideIveiteModel = () => {
        this.setState({ inviteModel: false });
    }
    inviteNotice = () => {
        const { inviteModel, inviteModelName } = this.state;
        return (
            <InviteModel
                show={inviteModel}
                title=""
                animation="vertical"
                mask={inviteModel}
                height="auto"
                footer={<div />}
            >
                <div style={{ padding: '30px 0', marginTop: '-22px', background: '#fff', textAlign: 'center' }}>
                    <p className="margin-bottom-20 font20">您已成功加入团队： <span className="font24" style={{ fontWeight: 'bolder' }}>{inviteModelName}</span></p>
                    <div style={{ textAlign: 'center' }}><img style={{ width: '200px' }} src="http://oxldjnom8.bkt.clouddn.com/invite_work.png" alt="" /></div>
                    <Button className="e-mg-button margin-top-20" onClick={this.hideIveiteModel}>开启团队协作之旅</Button>
                </div>
            </InviteModel>
        );
    }
    renderTeamMembers = (teamId, currentDeps, deps) => {
        console.log(currentDeps);
        return <TeamMembers teamId={teamId} depsId={currentDeps} deps={deps} />;
    }
    renderChatType = (chatType) => {
        // console.log(chatType);
        switch (chatType) {
        case 'message':
            // console.log('aaa', this);
            return <ChatWindow to={this.state.to} userId={this.state.userId} changeTo={this.changeTo} handleToggle={this.handleToggle} />;
        case 'newFriend':
            return <NewFriend />;
        case 'teamMembers':
            console.log(this.state.currentDeps);
            return this.renderTeamMembers(this.state.currentKey, this.state.currentDeps, this.state.deps);
        default:
            return <EmptyChat />;
        }
    }
    render() {
        // console.log(111, this.state.chatType);
        return (
            <div className="ejianlian-chat">
                <div className="left">
                    {/* 邀请提示框 */}
                    {this.inviteNotice()}
                    {/* 导航部分 */}
                    <div className="ejianlian-chat-nav">
                        <div className="chat-search">
                            <SearchChat changeTo={this.changeTo} />
                        </div>
                        <ul className="chat-type">
                            {
                                this.state.chatSideNav.map((item, index) => (
                                    <li
                                        key={index}
                                        className="chat-to-message"
                                        style={{ color: this.state.selected === index + 1 ? '#29B6F6' : '#BBC1D7' }}
                                        onClick={this.handleClick.bind(this, index + 1)}
                                    >
                                        <p className="type-icon">
                                            <i className={`iconfont ${item.content}`} />
                                        </p>
                                        <p>{item.name}</p>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="ejianlian-chat-user-list">
                        {this.state.selected === 1 ?
                            <ContactList
                                changeTo={this.changeTo}
                                handleToggle={this.handleToggle}
                                selectedChat={this.state.selectedChat}
                                handleNewFriend={this.handleChatType}
                            /> : null}
                        {this.state.selected === 2 ?
                            <div className="linkman-nav">
                                {
                                    this.state.linkManNav.map((item, index) => (
                                        <div
                                            key={index}
                                            className={classnames('linkman-list', { linkmanActive: this.state.selectedLinkMan === index + 1 })}
                                            onClick={this.handleLinkManNav.bind(this, index + 1)}
                                        >
                                            <p>{item.name}</p>
                                        </div>
                                    ))
                                }
                            </div>

                            : null}
                        {this.state.selectedLinkMan === 1 && this.state.selected === 2 ?
                            <FriendsList
                                changeTo={this.changeTo}
                                handleClick={this.handleClick.bind(this, 1)}
                                handleNewFriend={this.handleChatType}
                            /> : null}
                        {this.state.selectedLinkMan === 2 && this.state.selected === 2 ?
                            <GroupList
                                changeTo={this.changeTo}
                                handleClick={this.handleClick.bind(this, 1)}
                            /> : null}
                        {this.state.selected === 3 ?
                            <TeamList
                                handleTeamMembers={this.handleTeamMembers}
                            /> : null}
                    </div>
                    <AddChat
                        changeTo={this.changeTo}
                        handleToggle={this.handleToggle}
                    />
                </div>
                <div className="chat-right">
                    {
                        this.renderChatType(this.state.chatType)
                    }
                </div>
            </div>
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('message');
    const chatList = UserUtil.getChatList();
    return {
        chatList,
    };
})(Chat);
