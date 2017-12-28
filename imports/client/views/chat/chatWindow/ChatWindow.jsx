import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Popover, Tooltip, Progress, Spin } from 'antd';
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

import ChatFriendInfo from './ChatFriendInfo';
import ChatFriendFile from './ChatFriendFile';

import ChatHeader from './ChatHeader';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import expressions from '../../../../util/expressions';
import ImageViewer from '../../../features/ImageViewer';
import VideoMeeting from '../../../features/VideoMeeting';
// import EmptyChat from '../../../components/EmptyChat';


const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';


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
    }
    componentWillMount() {
        const { match, location, chatGroup } = this.props;
        console.log('componentWillMount', chatGroup);
        Meteor.call('readMessage', chatGroup._id, (err) => {
            if (err) {
                feedback.dealError(err);
            }
        });
        this.setState({ to: match.params.to, chatType: location.state && location.state.type });
    }
    componentDidMount() {
        // document.onmousedown = doDown;
        // document.onmouseup = doUp;
        // document.onmousemove = doMove;
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log('componentWillReceiveProps', nextProps);
    //     if (nextProps.messages.length !== this.state.messages) {
    //         this.setState({ messages: nextProps.messages });
    //     }
    // }
    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate');
        const { match, chatGroup } = this.props;
        if (chatGroup._id === match.params.to) {
            Meteor.call('readMessage', chatGroup._id, (err) => {
                if (err) {
                    feedback.dealError(err);
                }
            });
        }
        if (this.state.to) {
            this.$message.addEventListener('keydown', this.handleSendMessage);
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
    showFriendShip = () => {
        this.setState({
            isNewFriend: true,
        });
    }
    handleGroupNotice = () => {
        this.setState({
            isShowNotice: !this.state.isShowNotice,
        });
        this.readNotice();
    }
    handleFriendId = (chatFriendId) => {
        this.setState({
            chatFriendId,
            isShowFriendInfo: true,
        });
    }
    handleFriendInfo = () => {
        this.setState({
            isShowFriendInfo: false,
            isShowGroupSet: false,
        });
    }
    handleFriendFile = () => {
        this.setState({
            isShowFriendFile: !this.state.isShowFriendFile,
        });
    }
    showGroupSet = () => {
        this.setState({
            isShowGroupSet: !this.state.isShowGroupSet,
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
    sendMessage = (content, type) => {
        if (!content) {
            return feedback.dealWarning('请输入要发送的内容');
        }
        const { chatType } = this.state;
        const { chatGroup } = this.props;
        const { members = [] } = chatGroup;
        const resMes = { content, chatType, type, to: [] };
        if (chatType === 'group' || chatType === 'team') {
            resMes.groupId = chatGroup._id;
            members.forEach((userId) => {
                const user = { userId };
                if (userId === Meteor.userId()) {
                    user.isRead = true;
                }
                resMes.to.push(user);
            });
        }
        if (chatType === 'user') {
            const user = { userId: Meteor.userId(), isRead: true };
            resMes.to.push(user);
        }
        console.log('...resMes', resMes);
        Meteor.call(
            'insertMessage',
            {
                ...resMes,
            },
            (err) => {
                if (err) {
                    feedback.dealError(err);
                }
                this.$message.value = '';
            });
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.sendText();
        }
    }
    // 发送文字和表情
    sendText = () => {
        this.sendMessage(this.$message.value.replace(/\n|\r\n/g, '<br/>'), 'text');
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value += `#(${name})`;
    }
    // 显示为已读公告
    readNotice = () => {
        this.setState({
            isNewNotice: false,
        });
    }
    convertExpression = txt => ({
        __html: txt.replace(
            /#\(([\u4e00-\u9fa5a-z0-9-]+)\)/g,
            (r, e) => {
                const index = expressions.default.indexOf(e);
                if (index !== -1) {
                    return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px" onerror="this.style.display='none'" alt="${r}">`;
                }
                return r;
            },
        ).replace(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
            r => (
                `<a href="${r}" rel="noopener noreferrer" target="_blank">${r}</a>`
            ),
        ),
    })
    // 发送文件
    sendFile = () => {
        this.fileInput.click();
    }
    selectFile = () => {
        const file = this.fileInput.files[0];
        console.log('files', this.fileInput.files, file);
        if (!file) {
            return;
        }
        const name = file.name;
        const reader = new FileReader();
        const fileType = file.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = file.size;
        const me = this;
        const sendMessage = this.sendMessage;
        const handlePercent = this.handlePercent;
        reader.onprogress = function (e) {
            console.log(e.loaded);
            console.log(name);
            me.loaded += e.loaded;
            me.progress = (e.loaded / e.total) * 100;
            console.log((e.loaded / e.total) * 100);
            console.log(me.progress);
            setTimeout(() => {
                handlePercent(me.progress);
            }, 80);
            // me.setState({
            //     show: true,
            // });
        };
        reader.onloadend = function () {
            Meteor.call('insertFile', name, type, size, this.result, (err, res) => {
                if (err) {
                    return feedback.dealError(err);
                }
                if (res) {
                    sendMessage(res, 'file');
                }
            });
        };
        reader.readAsDataURL(file);
    };
    // reader.readAsDataURL(file);
    //     })
    // }
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
    handleImageDoubleClick = (url) => {
        this.setState({
            showImgViewer: true,
            image: url,
        });
    }
    handleChatUser = (fromId, toId, groupId) => {
        if (fromId === Meteor.userId()) {
            return;
        }
        if (toId === groupId) {
            // 是一个群里的成员,允许创建临时会话
            this.setState({
                temporaryChat: true,
            });
            this.handleFriendId(fromId);
        }
    }
    // 个人资料显示临时会话的按钮
    handleFriendIdInfo = (friendId) => {
        if (friendId === Meteor.userId()) {
            this.setState({
                temporaryChat: false,
            });
        } else {
            this.setState({
                temporaryChat: true,
            });
        }

        this.handleFriendId(friendId);
    }
    closeImageViewer = () => {
        this.setState({
            showImgViewer: false,
        });
    }
    renderDefaultExpression = () => (
        <div className="default-expression" style={{ width: '400px', height: '130px' }}>
            {
                expressions.default.map((e, index) => (
                    <div
                        key={index}
                        data-name={e}
                        onClick={this.handleClick}
                        style={{ width: '40px', height: '40px', padding: '5px' }}
                    >
                        <Popover content={e} >
                            <div
                                className="no-click"
                                style={{ backgroundPosition: `left ${-30 * index}px`,
                                    backgroundImage: 'url(\'http://cdn.zg18.com/expressions.png\')',
                                    width: '30px',
                                    height: '30px' }}
                            />
                        </Popover>
                    </div>
                ))
            }
        </div>
    )

    renderFile = (content) => {
        const result = PopulateUtil.file(content);
        if (!result) {
            return;
        }
        if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(result.type)) {
            return this.renderImage(result.url);
        }
        const base64regex = /data:/;
        if (base64regex.test(result.url)) {
            setInterval(() => {
                let percent = this.state.percent + 10;
                if (percent > 99) {
                    percent = 99;
                    clearInterval(this.timer);
                }
                this.setState({ percent });
            }, 200);
        }
        return (
            <div className="file">
                <div className="file-icon">
                    <Icon icon="icon-wenjian" size={30} iconColor="#ffca28" />
                </div>
                <div>
                    <p>{result.name}</p>
                    <p className="file-size">{result.size}</p>
                </div>
                <a href={result.url} download>
                    下载
                </a>
                {
                    base64regex.test(result.url) ?
                        <Progress percent={this.state.percent} className="file-progress" />
                        :
                        null
                }
            </div>
        );
    }
    renderImage = url =>
        (
            <div className="user-img">
                <img
                    src={url}
                    height="100"
                    data-src={url}
                    ref={i => this.img = i}
                    onDoubleClick={() => this.handleImageDoubleClick(url)}
                />
            </div>)

    renderText = content => (
        <div className="user-message" dangerouslySetInnerHTML={this.convertExpression(content)} />
    )
    renderContent = (type, content) => {
        switch (type) {
        case 'text':
            return this.renderText(content);
        case 'file':
            return this.renderFile(content);
        default:
            return <span>未知消息</span>;
        }
    }
    render() {
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const { uploadLoadding } = this.state;
        console.log('this.props, this.state', this.props, this.state);
        return (<div className="ejianlian-chat-window">
            {
                this.state.isShowVideo ?
                    <VideoMeeting
                        closeVideo={this.sendVideo}
                    />
                    :
                    null
            }
            <ChatHeader {...this.props} />
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
                    this.props.messages.map((message, index) => (
                        <div
                            key={index}
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
            <div className="chat-window-bottom" ref={i => this.$chatBottom = i}>
                <div className="chat-message-input resizeMe">
                    <div className="chat-send-skill">
                        <p className="skill-icon">
                            <Popover placement="topLeft" content={this.renderDefaultExpression()} trigger="click">
                                <Icon icon="icon-biaoqing icon" />
                            </Popover>
                        </p>
                        <p className="skill-icon">
                            <Tooltip title="发送文件" mouseEnterDelay={1}>
                                <Icon icon="icon-wenjian icon" onClick={this.sendFile} />
                                <input
                                    className="input-file"
                                    type="file"
                                    ref={i => this.fileInput = i}
                                    onChange={this.selectFile}
                                />
                            </Tooltip>
                        </p>
                    </div>
                    <div className="chat-send-bts">
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} placeholder="输入内容(shift+enter换行)" />
                        <p className="chat-send-message" onClick={this.sendText}>发送</p>
                    </div>
                </div>
            </div>
            {
                this.state.isShowFriendInfo ?
                    <ChatFriendInfo
                        handleFriendInfo={this.handleFriendInfo}
                        friendId={this.state.chatFriendId}
                        temporaryChat={this.state.temporaryChat}
                        changeTo={this.props.changeTo}
                        handleToggle={this.props.handleToggle}
                        handleClick={this.props.handleClick}
                    />
                    :
                    null

            }
            {
                this.state.isShowFriendFile ?
                    <ChatFriendFile
                        handleFriendFile={this.handleFriendFile}
                        files={this.props.files}
                    />
                    :
                    null
            }
            {
                this.state.showImgViewer ?
                    <ImageViewer
                        image={this.state.image}
                        closeImage={this.closeImageViewer}
                    />
                    :
                    null
            }
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

