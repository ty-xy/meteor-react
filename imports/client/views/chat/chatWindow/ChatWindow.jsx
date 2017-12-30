import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Progress, Spin } from 'antd';
import format from 'date-format';
import ReactChatView from 'react-chatview';
// import qiniu from 'qiniu-js';
// /* global Qiniu */
// /* global plupload */

import Message from '../../../../../imports/schema/message';
import Group from '../../../../../imports/schema/group';
import PopulateUtil from '../../../../util/populate';
import feedback from '../../../../util/feedback';
import formatDate from '../../../../util/formatDate';
import userInfo from '../../../../util/user';
// import { doDown, doUp, doMove } from '../../../../util/resize';

import ChatHeader from './ChatHeader';
import ChatFriendInfo from './ChatFriendInfo';
import Avatar from '../../../components/Avatar';
import VideoMeeting from '../../../features/VideoMeeting';

import Text from './component/Text';
import Files from './component/Files';
import Send from './component/Send';


@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        chatUser: PropTypes.object,
        chatGroup: PropTypes.object,
        match: PropTypes.object,
        location: PropTypes.object,
        files: PropTypes.array,
        changeTo: PropTypes.func,
        handleToggle: PropTypes.func,
        handleClick: PropTypes.func,
        getMoreMessage: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            isShowFriendFile: false,
            isShowGroupSet: false,
            showImgViewer: false,
            image: '',
            videoTracks: null,
            isShowVideo: false,
            isShowNotice: false,
            temporaryChat: false,
            chatFriendId: '',
            isNewFriend: false,
            isNewNotice: false,
            percent: 0,
            uploadLoadImg: '',
            messages: [],
            to: '',
        };
        this.onScrollHandle = null;
        this.lastTime = '';
    }
    componentWillMount() {
        const { chatGroup } = this.props;
        Meteor.call('readMessage', chatGroup._id, (err) => {
            if (err) {
                feedback.dealError(err);
            }
        });
    }
    componentDidMount() {
        // document.onmousedown = doDown;
        // document.onmouseup = doUp;
        // document.onmousemove = doMove;
    }
    componentDidUpdate(prevProps) {
        const { match, chatGroup } = this.props;
        if (chatGroup._id === match.params.to) {
            Meteor.call('readMessageLast', chatGroup._id, (err) => {
                if (err) {
                    feedback.dealError(err);
                }
            });
        }
        if (prevProps.chatGroup && chatGroup && prevProps.chatGroup.notice !== chatGroup.notice) {
            this.setState({
                isNewNotice: true,
            });
        }
    }
    componentWillUnmount() {
        document.onmousedown = null;
        document.onmouseup = null;
        document.onmousemove = null;
    }
    handleToggle = (value) => {
        this.setState({
            selectedChat: {
                [value]: true,
            },
            count: 1,
        });
    }
    // 个人信息model
    handleFriendId = (chatFriendId) => {
        this.setState({
            chatFriendId,
            isShowFriendInfo: true,
        });
    }
    // 个人信息关闭
    handleFriendInfoClose = () => {
        this.setState({
            isShowFriendInfo: false,
            isShowGroupSet: false,
        });
    }
    handleMessageListScroll() {
        this.setState({ showHistoryLoading: true });
        return new Promise((resolve) => {
            this.props.getMoreMessage().then(() => {
                this.setState({ showHistoryLoading: false });
            });
            resolve();
        });
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value += `#(${name})`;
    }
    // 发起视频
    handlePercent=(percent) => {
        if (percent === 100) {
            this.setState({
                percent: percent.toFixed(2),
                uploadLoadding: false,
            });
        } else {
            this.setState({
                percent: percent.toFixed(2),
                uploadLoadding: true,
            });
        }
    }
    sendVideo = () => {
        this.setState({
            isShowVideo: !this.state.isShowVideo,
        });
    }
    // 聊天窗口点击人员头像查看信息
    handleChatUser = (fromId, toId, groupId) => {
        console.log('handleChatUser', fromId, toId, groupId);
        if (fromId === Meteor.userId()) {
            return;
        }
        this.handleFriendId(fromId);
        // if (toId === groupId) {
        //     // 是一个群里的成员,允许创建临时会话
        //     this.setState({
        //         temporaryChat: true,
        //     });
        //     this.handleFriendId(fromId);
        // }
    }
    renderContent = (type, content) => {
        switch (type) {
        case 'text':
            return <Text content={content} />;
        case 'file':
            return <Files content={content} />;
        default:
            return <span>未知消息</span>;
        }
    }
    render() {
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const { uploadLoadding } = this.state;
        console.log('messages', this.props.messages);
        return (<div className="ejianlian-chat-window">
            {
                this.state.isShowVideo ?
                    <VideoMeeting
                        closeVideo={this.sendVideo}
                    />
                    :
                    null
            }
            {/* 人员信息 */}
            {
                this.state.isShowFriendInfo ?
                    <ChatFriendInfo
                        handleFriendInfo={this.handleFriendInfoClose}
                        friendId={this.state.chatFriendId}
                        temporaryChat={this.state.temporaryChat}
                        handleToggle={this.handleToggle}
                        handleClick={this.handleClick}
                    />
                    :
                    null

            }
            <ChatHeader {...this.props} handleFriendId={this.handleFriendId} handleFriendInfo={this.handleFriendInfoClose} />
            {
                this.state.showHistoryLoading ?
                    <Spin />
                    :
                    null
            }

            <ReactChatView
                className="content chat-message-list"
                flipped
                scrollLoadThreshold={50}
                onInfiniteLoad={this.handleMessageListScroll.bind(this)}
            >
                {
                    this.props.messages.map(message => (
                        <div
                            key={message._id}
                        >
                            {
                                message.showYearMonth ?
                                    <div className="message-time">{formatDate.dealMessageTime(message.createdAt)}</div>
                                    :
                                    null
                            }
                            <div className={message.from._id === Meteor.userId() ? 'self-message' : 'message'}>
                                <p className="user-avatar" onClick={() => this.handleChatUser(message.from._id, message.to, groupId)}>
                                    <Avatar name={message.from.profile.name} avatarColor={message.from.profile.avatarColor} avatar={message.from.profile.avatar} />
                                </p>
                                <div className="user-message-wrap">
                                    {
                                        message.to === groupId ?
                                            <p className="user-nickname">{message.from.profile.name}</p>
                                            :
                                            null
                                    }
                                    {
                                        this.renderContent(message.type, message.content)
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    uploadLoadding && <div className="self-message">
                        <p className="user-avatar">
                            <span className="avatar" style={{ backgroundColor: 'rgb(245, 91, 137)' }}>{userInfo.getName().substr(-2, 2)}</span>
                        </p>
                        <div className="user-message-wrap">
                            <p className="user-nickname">{userInfo.getName()}</p>
                            <div className="user-img">
                                <img src="http://cdn.zg18.com/commonImg.png" ref={i => this.imgPreview = i} />
                                <Progress percent={this.state.percent} className="img-progress" />
                            </div>
                        </div>
                    </div>
                }
            </ReactChatView>
            <Send {...this.props} />
        </div>);
    }
}

export default withTracker(({ count, match }) => {
    const to = match.params.to;
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    Meteor.subscribe('files');
    const chatGroup = Group.findOne({ _id: to }) || {};
    // PopulateUtil.group(chatGroup);
    const files = Message.find({ groupId: to, type: 'file' }, { sort: { createdAt: -1 } }).fetch().map(msg => PopulateUtil.file(msg.content));
    if (files[0]) {
        files.forEach((d, i, data) => {
            d.showYearMonth = false;
            d.fileFrom = PopulateUtil.user(d.from).profile.name;
            if (i) {
                const prev = data[i - 1];
                d.showYearMonth = format('yyyy-MM', d.createdAt) !== format('yyyy-MM', prev.createdAt);
            } else {
                d.showYearMonth = true;
            }
        });
    }
    const messages = Message.find({ groupId: to }, { sort: { createdAt: -1 }, limit: 30 * count }).fetch().reverse();
    messages.forEach((d, i, data) => {
        d.readed = d.readedMembers && d.readedMembers.includes(Meteor.userId());
        d.from = PopulateUtil.message(d.from);
        d.showYearMonth = false;
        if (i) {
            const prev = data[i - 1];
            d.showYearMonth = d.createdAt.getTime() - prev.createdAt.getTime() > 10 * 60 * 1000;
        } else {
            d.showYearMonth = true;
        }
    });
    return {
        messages,
        to,
        chatUser: Meteor.users.findOne({ _id: Meteor.userId() }) || {},
        chatGroup,
        files,
    };
})(ChatWindow);

