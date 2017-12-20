import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Popover, Tooltip, Progress, Modal, Spin } from 'antd';
import format from 'date-format';
// import 'qiniu-js/src/plupload/plupload.dev';

import userInfo from '../../../../util/user';
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

import { lazy, throttle } from '../../../../util/throttle';
// import { generateShowHourMinuteSecond } from 'antd/lib/time-picker';

require('qiniu-js/dist/qiniu.min');

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
        handleClick: PropTypes.func,
        getMoreMessage: PropTypes.func,
        count: PropTypes.number,
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
        this.onScrollHandle = null;
    }
    componentDidUpdate(prevProps) {
        for (let i = this.props.messages.length - 1; i >= 0; i--) {
            if (!this.props.messages[i].readed) {
                Meteor.call('readMessage', this.props.messages[i]._id, Meteor.userId(), (err) => {
                    if (err) {
                        feedback.dealError(err);
                    }
                });
            } else {
                break;
            }
        }
        if (prevProps.messages && this.props.messages && prevProps.messages.length !== this.props.messages.length && this.messageList && this.messageList.children.length > 0) {
            const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
            if ($lastMessage && this.props.count === 1) {
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
    handleMessageListScroll = (e) => {
        const $messageList = e.target;
        function d() {
            console.log('======');
        }
        console.log('scrollHeight-clientHeight-scrollTop', $messageList.scrollHeight, $messageList.clientHeight, $messageList.scrollTop);
        $messageList.addEventListener('scroll', throttle(lazy($messageList, d), 500, 1000), false);

        if (this.onScrollHandle) {
            clearTimeout(this.onScrollHandle);
        }
        // this.tt = Date.now();
        this.onScrollHandle = setTimeout(() => {
            // console.log('耗时', Date.now() - this.tt);
            // console.log($messageList.scrollHeight, $messageList.clientHeight, $messageList.scrollTop, $messageList.scrollHeight !== $messageList.clientHeight, $messageList.scrollTop < 10);
            if ($messageList.scrollHeight !== $messageList.clientHeight && $messageList.scrollTop < 10) {
                this.setState({ showHistoryLoading: true });
                this.props.getMoreMessage();
                setTimeout(() => {
                    this.setState({ showHistoryLoading: false });
                }, 80);
            }
            // action.setAutoScroll($messageList.scrollHeight - $messageList.scrollTop - $messageList.clientHeight < $messageList.clientHeight / 2);
        }, 300);
    }
    sendMessage = (content, type) => {
        if (!content) {
            return feedback.dealWarning('请输入要发送的内容');
        }
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
        const files = this.fileInput.files[0];
        if (!files) {
            return;
        }
        console.log('files', this.fileInput.files, files);
        const name = files.name;
        const fileType = files.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = files.size;
        const sendMessage = this.sendMessage;
        const _this = this;
        Meteor.call(
            'createToken',
            (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('createToken');
                    const option1 = {
                        runtimes: 'html5,flash,html', // 上传模式，依次退化
                        browse_button: this.fileInput, // 上传选择的点选按钮，必需
                        // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                        // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                        // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                        uptoken: res.token, // uptoken是上传凭证，由其他程序生成
                        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
                        multi_selection: false,
                        // downtoken_url: '/downtoken',
                        // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                        unique_names: false, // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                        save_key: false, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                        domain: 'http://up-z1.qiniu.com', // bucket域名，下载资源时用到，必需
                        container: this.$message, // 上传区域DOM ID，默认是browser_button的父元素
                        max_file_size: '100mb', // 最大文件体积限制
                        flash_swf_url: 'path/of/plupload/Moxie.swf', // 引入flash，相对路径
                        max_retries: 0, // 上传失败最大重试次数
                        dragdrop: true, // 开启可拖曳上传
                        drop_element: this.$message, // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                        chunk_size: '4mb', // 分块上传时，每块的体积
                        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                        init: {
                            FilesAdded(up, file) {
                                // plupload.each(files, (file) => {
                                //     // 文件添加进队列后，处理相关的事情
                                // });
                                const reader = new FileReader();
                                file[0].name = Math.random().toString(16).substring(2);
                                console.log('filedAdd', file);
                                reader.readAsDataURL(files);
                                reader.onload = function () {
                                    _this.setState({ uploadLoadding: true });
                                };
                                // console.log('FilesAdded', file);
                                // _this.setState({ uploadLoadding: true });
                            },
                            BeforeUpload() {
                                // 每个文件上传前，处理相关的事情
                                console.log('BeforeUpload');
                            },
                            UploadProgress(up, file) {
                                // 每个文件上传时，处理相关的事情
                                _this.setState({ percent: file.percent });
                            },
                            FileUploaded(up, file, info) {
                                // 每个文件上传成功后，处理相关的事情
                                // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                                // {
                                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                //    "key": "gogopher.jpg"
                                //  }
                                // 查看简单反馈
                                // var domain = up.getOption('domain');
                                // var res = parseJSON(info.response);
                                // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url
                                _this.setState({ uploadLoadding: false });
                                const filesize = (size || 0).toString();
                                const resInfo = JSON.parse(info.response);
                                const url = `http://oxldjnom8.bkt.clouddn.com/${resInfo.key}`;
                                console.log('uploaded', up, file, resInfo);
                                Meteor.call('clientInsertFile', name, type, filesize, url, (err_, fileId) => {
                                    if (err_) {
                                        return feedback.dealError(err_);
                                    }
                                    if (res) {
                                        sendMessage(fileId, 'file');
                                    }
                                });
                            },
                            Error() {
                                // 上传出错时，处理相关的事情
                            },
                            UploadComplete() {
                                // 队列文件处理完毕后，处理相关的事情
                            },
                            // Key() {
                            //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            //     // 该配置必须要在unique_names: false，save_key: false时才生效
                            //     const key = '';
                            //     // do something with key here
                            //     return key;
                            // },
                        },
                    };
                    window.Qiniu.uploader(option1);
                }
            },
        );
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
                    src=""
                    data-src={url}
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
        const memberIds = this.props.chatGroup ? this.props.chatGroup.members : [];
        const admin = this.props.chatGroup ? this.props.chatGroup.admin : '';
        const notice = this.props.chatGroup ? this.props.chatGroup.notice : '';
        const noticeTime = this.props.chatGroup ? this.props.chatGroup.noticeTime : new Date();
        const isDisturb = this.props.chatGroup ? this.props.chatGroup.isDisturb : [];
        const stickTop = this.props.chatGroup ? this.props.chatGroup.stickTop.find(x => x.userId && x.userId === Meteor.userId()) : {};
        const groupAvatar = this.props.chatGroup ? this.props.chatGroup.avatar : '';
        const groupType = this.props.chatGroup ? this.props.chatGroup.type : 'group';
        const { uploadLoadding } = this.state;
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
                {
                    this.state.showHistoryLoading ?
                        <Spin />
                        :
                        null
                }
                <div className="chat-message-list" ref={i => this.messageList = i} onScroll={this.handleMessageListScroll}>
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
                                    <img src="/commonImg.png" ref={i => this.imgPreview = i} />
                                    <Progress percent={this.state.percent} className="img-progress" />
                                </div>
                            </div>
                        </div>
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
                    </div>
                    <div className="chat-message-input">
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} placeholder="输入内容(shift+enter换行)" />
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
                    this.state.isShowGroupSet ?
                        <Modal
                            title="群设置"
                            visible
                            onCancel={this.showGroupSet}
                            width={370}
                            wrapClassName="create-team-mask"
                            footer={null}
                        >
                            <GroupSetting
                                showGroupSet={this.showGroupSet}
                                groupName={groupName}
                                groupMemberIds={memberIds}
                                groupId={groupId}
                                admin={admin}
                                isDisturb={isDisturb}
                                stickTop={stickTop}
                                avatar={groupAvatar}
                                changeTo={this.props.changeTo}
                                handleFriendIdInfo={this.handleFriendIdInfo}
                                groupType={groupType}
                                handleToggle={this.props.handleToggle}
                            />
                        </Modal>

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

export default withTracker(({ to, userId, count }) => {
    // console.log('加载次数', count);
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    Meteor.subscribe('files');
    const chatGroup = Group.findOne({ _id: to });
    // PopulateUtil.group(chatGroup);
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
    const messages = Message.find({ to }, { sort: { createdAt: -1 }, limit: 30 * count }).fetch().reverse();

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
    // console.log(787878, messages);
    return {
        messages,
        to,
        chatUser: Meteor.users.findOne({ _id: userId }),
        chatGroup,
        files,
    };
})(ChatWindow);

