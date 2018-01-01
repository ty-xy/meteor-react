import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Popover, Tooltip } from 'antd';
import Icon from '../../../../components/Icon';
import feedback from '../../../../../util/feedback';
import expressions from '../../../../../util/expressions';


class Send extends PureComponent {
    static propTypes = {
        match: PropTypes.object,
        chatGroup: PropTypes.object,
        location: PropTypes.object,
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
        if (match.params.to) {
            this.$message.addEventListener('keydown', this.handleSendMessage);
        }
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            this.sendText();
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
        console.log('resMes', resMes, members.filter(value => value !== Meteor.userId()));
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
                }
                this.lastTime = res;
                this.$message.value = '';
            });
    }
    // 发送文字和表情
    sendText = () => {
        this.sendMessage(this.$message.value.replace(/\n|\r\n/g, '<br/>'), 'text');
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value += `#(${name})`;
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
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} placeholder="输入内容(shift+enter换行)" />
                        <p className="chat-send-message" onClick={this.sendText}>发送</p>
                    </div>
                </div>
            </div>
        );
    }
}


export default Send;
