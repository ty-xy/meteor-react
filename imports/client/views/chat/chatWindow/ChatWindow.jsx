import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Popover, Tooltip, Progress } from 'antd';
import format from 'date-format';

import Message from '../../../../../imports/schema/message';
import Group from '../../../../../imports/schema/group';
import PopulateUtil from '../../../../util/populate';
import feedback from '../../../../util/feedback';
import formatDate from '../../../../util/formatDate';

import ChatFriendInfo from './ChatFriendInfo';
import ChatFriendFile from './ChatFriendFile';
import GroupNotice from './GroupNotice';
import GroupSetting from './GroupSetting';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import expressions from '../../../../util/expressions';
import ImageViewer from '../../../features/ImageViewer';
import VideoMeeting from '../../../features/VideoMeeting';
import EmptyChat from '../../../components/EmptyChat';

// import messageTool from '../../../../util/message';
const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';

@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        to: PropTypes.string,
        chatUser: PropTypes.object,
        chatGroup: PropTypes.object,
        files: PropTypes.array,
        changeTo: PropTypes.func,
        handleToggle: PropTypes.func,
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
        };
    }
    componentDidUpdate(prevProps) {
        this.props.messages.forEach((i) => {
            if (i.readedMembers && !i.readedMembers.includes(Meteor.userId())) {
                Meteor.call('readMessage', i._id, Meteor.userId(), (err) => {
                    console.log(err);
                });
            }
        });
        if (prevProps.messages && this.props.messages && prevProps.messages.length !== this.props.messages.length && this.messageList && this.messageList.children.length > 0) {
            const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
            if ($lastMessage) {
                // 优化一下,有时间写个函数节流,延迟200ms,这样初始渲染的时候, 就不会连续的scroll了,
                $lastMessage.scrollIntoView(true);
            }
        }
        if (this.props.to) {
            this.$message.addEventListener('keydown', this.handleSendMessage);
        }
        if (prevProps.chatGroup && this.props.chatGroup && prevProps.chatGroup.notice !== this.props.chatGroup.notice) {
            this.setState({
                isNewNotice: true,
            });
        }
    }
    componentWillUnmount() {
        this.$message.removeEventListener('keydown', this.handleSendMessage);
    }

    // 图片初始高度是0, 图片加载完成后, 把消息撑了起来, 这时候scrollIntoView已经执行完了,所以会出现看到聊天窗口的时候最后一条消息被挡上了,需要滚动一下才能看到
    // 表情, 写死高度.  图片消息, 等图片onLoad的时候, 再执行一次最后一条消息的 scrollIntoView
    imageLoad = () => {
        const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
        if ($lastMessage) {
            $lastMessage.scrollIntoView(true);
        }
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
    sendMessage = (content, type) => {
        Meteor.call(
            'insertMessage',
            {
                content,
                to: this.props.to,
                type,
            },
            (err) => {
                feedback.dealError(err);
                this.$message.value = '';
            });
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendText();
        }
    }
    // 发送文字和表情
    sendText = () => {
        this.sendMessage(this.$message.value, 'text');
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
                    return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px; background-image: url('/expressions.png'); width: 30px ;height: 30px;" onerror="this.style.display='none'" alt="${r}">`;
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
        if (!file) {
            return;
        }
        const reader = new FileReader();
        const name = file.name;
        const fileType = file.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = file.size;
        const sendMessage = this.sendMessage;

        reader.onloadend = function () {
            Meteor.call('insertFile', name, type, size, this.result, (err, res) => {
                feedback.dealError(err);
                if (res) {
                    sendMessage(res, 'file');
                }
            });
        };
        reader.readAsDataURL(file);
    }
    // 发起视频
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
            // console.log('是一个群里的成员,允许创建临时会话');
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
        <div className="default-expression" style={{ width: '400px', height: '200px' }}>
            {
                expressions.default.map((e, index) => (
                    <div
                        key={index}
                        data-name={e}
                        onClick={this.handleClick}
                        style={{ width: '40px', height: '40px', padding: '5px' }}
                    >
                        <div className="no-click" style={{ backgroundPosition: `left ${-30 * index}px`, backgroundImage: 'url(\'/expressions.png\')', width: '30px', height: '30px' }} />
                    </div>
                ))
            }
        </div>
    )

    renderFile = (content) => {
        // console.log(99999, content);
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
    renderImage = (url) => {
        const base64regex = /data:/;
        if (base64regex.test(url)) {
            setInterval(() => {
                let percent = this.state.percent + 10;
                if (percent > 99 || !base64regex.test(url)) {
                    percent = 99;
                    clearInterval(this.timer);
                }
                this.setState({ percent });
            }, 200);
        }
        return (
            <div className="user-img">
                <img
                    src={url}
                    ref={i => this.img = i}
                    onLoad={this.imageLoad}
                    onDoubleClick={() => this.handleImageDoubleClick(url)}
                    onError={() => this.img.src = 'http://oxldjnom8.bkt.clouddn.com/404Img.jpeg'}
                />
                {
                    base64regex.test(url) ?
                        <Progress percent={this.state.percent} className="img-progress" />
                        :
                        null
                }
            </div>);
    }
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
        const { profile = {}, _id = '' } = this.props.chatUser || {};
        const { name = '' } = profile;
        const groupName = this.props.chatGroup ? this.props.chatGroup.name : '';
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const members = this.props.chatGroup ? this.props.chatGroup.members : [];
        const admin = this.props.chatGroup ? this.props.chatGroup.admin._id : '';
        const notice = this.props.chatGroup ? this.props.chatGroup.notice : '';
        const noticeTime = this.props.chatGroup ? this.props.chatGroup.noticeTime : new Date();
        const isDisturb = this.props.chatGroup ? this.props.chatGroup.isDisturb : false;
        const stickTop = this.props.chatGroup ? this.props.chatGroup.stickTop : {};
        const groupAvatar = this.props.chatGroup ? this.props.chatGroup.avatar : '';
        return this.props.to ?
            <div className="ejianlian-chat-window">
                {
                    this.state.isShowVideo ?
                        <VideoMeeting
                            closeVideo={this.sendVideo}
                        />
                        :
                        null
                }
                {
                    name ?
                        <div className="chat-to-user">
                            {name}
                            <div className="chat-other-account">
                                <p>
                                    <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
                                </p>
                                <p>
                                    <Icon
                                        icon="icon-gerenziliao icon"
                                        onClick={() => this.handleFriendId(_id)}
                                    />
                                </p>
                            </div>
                        </div>
                        :
                        <div className="chat-to-user">
                            {groupName}
                            <div className="chat-other-account">
                                <p>
                                    {
                                        this.state.isNewNotice ?
                                            <span className="notive-red-not" />
                                            :
                                            null
                                    }

                                    <Icon icon="icon-tongzhi2 icon" onClick={this.handleGroupNotice} />
                                </p>
                                <p>
                                    <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
                                </p>
                                <p>
                                    <Icon icon="icon-shezhi icon" onClick={this.showGroupSet} />
                                </p>
                            </div>
                        </div>
                }
                <div className="chat-message-list" ref={i => this.messageList = i}>
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
                                    {/* <div>{message.from._id !== Meteor.userId() ? '' : (message.readedMembers.includes(message.to) ? '(已读)' : '(未读)')}</div> */}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="chat-window-bottom">
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
                        {/* <p className="skill-icon">
                            <Icon icon="icon-card icon" />
                        </p> */}
                        {/* <p className="skill-icon">
                            <Icon icon="icon-dakaishipin icon" size={20} onClick={this.sendVideo} />
                        </p> */}
                    </div>
                    <div className="chat-message-input">
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} />
                        <p className="chat-send-message" onClick={this.sendText}>发送</p>
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
                    this.state.isShowGroupSet ?
                        <GroupSetting
                            showGroupSet={this.showGroupSet}
                            groupName={groupName}
                            members={members}
                            groupId={groupId}
                            admin={admin}
                            isDisturb={isDisturb}
                            stickTop={stickTop}
                            avatar={groupAvatar}
                            changeTo={this.props.changeTo}
                            handleFriendIdInfo={this.handleFriendIdInfo}
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
                {
                    this.state.isShowNotice ?
                        <GroupNotice
                            handleGroupNotice={this.handleGroupNotice}
                            admin={admin}
                            notice={notice}
                            groupId={groupId}
                            noticeTime={noticeTime}
                            showNewNotice={this.showNewNotice}
                        />
                        :
                        null
                }
            </div>

            :
            <EmptyChat />;
    }
}

export default withTracker(({ to, userId }) => {
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    Meteor.subscribe('file');
    const chatGroup = Group.findOne({ _id: to });
    PopulateUtil.group(chatGroup);
    const files = Message.find({ to, type: 'file' }, { sort: { createdAt: -1 } }).fetch().map(msg => PopulateUtil.file(msg.content));
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

    const messages = Message.find({ to }).fetch();
    messages.forEach((d, i, data) => {
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
        chatUser: Meteor.users.findOne({ _id: userId }),
        chatGroup,
        files,
    };
})(ChatWindow);

