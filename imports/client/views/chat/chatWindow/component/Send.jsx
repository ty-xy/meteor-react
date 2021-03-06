import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Popover, Tooltip } from 'antd';
import Icon from '../../../../components/Icon';
import feedback from '../../../../../util/feedback';
import expressions from '../../../../../util/expressions';
// import { doDown, doUp, doMove } from '../../../../util/resize';


class Send extends PureComponent {
    static propTypes = {
        match: PropTypes.object,
        chatGroup: PropTypes.object,
        location: PropTypes.object,
        handleToggle: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {
        const { match, location, chatGroup } = this.props;
        Meteor.call('readMessage', chatGroup._id, (err) => {
            if (err) {
                feedback.dealError(err);
            }
        });
        this.setState({ to: match.params.to, chatType: location.state && location.state.type });
    }
    componentDidMount() {
        const { match } = this.props;
        // document.onmousedown = doDown;
        // document.onmouseup = doUp;
        // document.onmousemove = doMove;
        if (match.params.to) {
            this.$message.addEventListener('keydown', this.handleSendMessage);
        }
        this.messageContext.setAttribute('contentEditable', true);
        this.placeholder.setAttribute('contentEditable', false);
        this.messageContext.focus();
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.sendText();
        }
        if (this.messageContext.innerText.length > 0) {
            this.placeholder.style = 'z-index: -1';
        }
        if (e.keyCode === 8 && this.messageContext.innerText.length < 1) {
            this.placeholder.style = 'z-index: 1';
            e.preventDefault();
            return 'false';
        }
    }
    sendMessage = (content, type) => {
        if (!content) {
            return feedback.dealWarning('请输入要发送的内容');
        }
        const { chatType } = this.state;
        const { chatGroup } = this.props;
        const { members = [] } = chatGroup;
        const resMes = { content, chatType, type, to: [] };
        resMes.groupId = chatGroup._id;
        members.forEach((userId) => {
            const user = { userId };
            if (userId === Meteor.userId()) {
                user.isRead = true;
            }
            resMes.to.push(user);
        });
        // console.log('resMes', resMes, members.filter(value => value !== Meteor.userId()));
        Meteor.call('addChatlist', chatGroup._id, members.filter(value => value !== Meteor.userId())[0], (err) => {
                feedback.dealError(err);
            });
        Meteor.call(
            'insertMessage',
            {
                ...resMes,
            },
            (err, res) => {
                if (err) {
                    feedback.dealError(err);
                } else {
                    this.lastTime = res;
                    this.messageContext.innerHTML = '';
                    this.placeholder.style = 'z-index: 1';
                    this.props.handleToggle();
                    this.messageContext.focus();
                }
            });
    }
    // 发送文字和表情
    sendText = () => {
        this.sendMessage(this.messageContext.innerHTML.replace(/\n|\r\n/g, '<br/>'), 'text');
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        const newSpan = document.createElement('span');
        newSpan.innerText = `#(${name})`;
        newSpan.style = 'margin: 0 3px';
        this.placeholder.style = 'z-index: -1';
        newSpan.setAttribute('contentEditable', false);
        this.messageContext.appendChild(newSpan);
        const nbsp = document.createElement('span');
        nbsp.style = 'width: 4px; height: 14px';
        this.messageContext.appendChild(nbsp);
    }
    // 发送文件
    sendFile = () => {
        this.fileInput.click();
    }
    selectFile = () => {
        const file = this.fileInput.files[0];

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
    render() {
        return (
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
                        {/* <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} placeholder="输入内容(shift+enter换行)">
                            <span>sjdkf</span>
                        </textarea> */}
                        <div className="chat-send-div" ref={i => this.$message = i}>
                            <div ref={i => this.messageContext = i} className="chat-send-context" />
                            <span ref={i => this.placeholder = i} className="chat-send-placeholder">输入内容(shift+enter换行)</span>
                        </div>
                        <p className="chat-send-message" onClick={this.sendText}>发送</p>
                    </div>
                </div>
            </div>
        );
    }
}


export default Send;
