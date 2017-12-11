import React, { Component } from 'react';
import { Modal, Calendar } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import format from 'date-format';
import moment from 'moment';
import { DragSource } from 'react-dnd';

import pureRender from 'pure-render-decorator';
import TaskList from '../../../../../../imports/schema/taskList';
import ProjectItemDetail from './projectItemDetail';
import Avatar from '../../../../components/Avatar';
import Task from '../../../../../../imports/schema/task';
import Active from '../../../../../../imports/schema/active';
import Icon from '../../../../components/Icon';

const ItemTypes = {
    CARD: 'card',
};
const source = {
    beginDrag(props) {
        console.log(props.textId, props.index);
        return { _id: props.textId, index: props.index };
    },
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        const currentOffset = monitor.getSourceClientOffset();
        console.log(item, dropResult, currentOffset);
        if (dropResult) {
            if (item.index !== dropResult.listName) {
                Meteor.call('changeArray', dropResult.listName, item._id, dropResult.y, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                Meteor.call('deleteArray', item.index, item._id, (err) => {
                    console.log(err);
                });
            } else if (item.index === dropResult.listName) {
                Meteor.call('deleteArray2', dropResult.listName, item._id, dropResult.y, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    },
};
const collect = connect => ({
    connectDragSource: connect.dragSource(),
});
@pureRender
class MiniCard extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        value: PropTypes.string,
        idIndex: PropTypes.string,
        begintime: PropTypes.instanceOf(Date),
        activeL: PropTypes.number,
        endtime: PropTypes.instanceOf(Date),
        label: PropTypes.string,
        index: PropTypes.string,
        ind: PropTypes.number,
        textId: PropTypes.string,
        deleteCard: PropTypes.func,
        projectId: PropTypes.string,
        TaskLength: PropTypes.number,
        taskOver: PropTypes.number,
        files: PropTypes.array,
        avatarColor: PropTypes.string,
        avatar: PropTypes.string,
        name: PropTypes.string,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowList: false,
            cardName: '',
            cardInput: '',
            visible: false,
            concern: false,
            mask: false,
            left: '',
            showStartTime: false,
            showOverTime: false,
        };
    }
    onPanelChange=(value) => {
        console.log(value.format('L'));
        Meteor.call(
            'changeTime', this.props.idIndex, value._d,
            (err) => {
                console.log(err);
            },
        );
        this.setState({
            showStartTime: !this.state.showStartTime,
        });
    }
    onPanellChange=(value) => {
        Meteor.call(
            'changeEndTime', this.props.idIndex, value._d,
            (err) => {
                console.log(err);
            },
        );
        this.setState({
            showOverTime: !this.state.showOverTime,
        });
    }
    disabledEndDate = (endValue) => {
        const startValue = this.props.begintime;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    handlePop =(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    showModal = (e) => {
        this.setState({
            visible: true,
            left: e.target.getBoundingClientRect().left,
        });
        console.log(e.target.offsetLeft, e.target.offsetParent, e.target.getBoundingClientRect().left);
    }
    handleChangeStart =(e) => {
        e.stopPropagation();
        this.setState({
            showStartTime: !this.state.showStartTime,
        });
    }
    handleChangeEnd =(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showOverTime: !this.state.showOverTime,
        });
    }
    // 处理时间背景的函数
    handleShowColor =() => {
        const time = Math.ceil((this.props.endtime - new Date()) / 1000 / 3600 / 24);
        if (time === 0 || time === 1) {
            const bStyle = {
                background: '#FFD663' };
            return bStyle;
        } else if (time < 0) {
            const bStyle = {
                background: '#EF5350' };
            return bStyle;
        } else if (time > 1) {
            const bStyle = {
                background: '#d8d8d8' };
            return bStyle;
        }
    }
    render() {
        const { connectDragSource } = this.props;
        return connectDragSource(
            <div
                className="list-message"
                data-id={this.props.idIndex}
                data-index={this.props.index}
                data-ind={this.props.ind}
                data-textid={this.props.textId}

            >
                <div
                    className={`list-message-item ${this.state.visible ? 'is-selected' : ''}`}
                    onClick={this.showModal}
                >
                    <div className="list-title-show">
                        <p className="task-title">{this.props.value}</p>
                        {this.props.label && this.props.label !== '#d8d8d8' ?
                            <p className="label-show" style={{ background: this.props.label }} /> : null}
                    </div>
                    <div className="try-stop" style={{ display: 'flex' }}>
                        {this.props.begintime ?
                            <div className="time-show" onClick={e => this.handleChangeStart(e)}>
                                <p className="time-number">{format('yyyy-MM-dd', this.props.begintime)}</p>
                                <div className="try" style={{ display: this.state.showStartTime ? 'block' : 'none' }} />
                                {this.state.showStartTime ?
                                    <div className="clender-setting" onClick={e => this.handlePop(e)}>
                                        <Calendar
                                            fullscreen={false}
                                            onSelect={this.onPanelChange}
                                            defaultValue={moment(this.props.begintime, 'YYYY-MM-DD')}
                                        />
                                        <button onClick={e => this.handleChangeStart(e)}>取消</button>
                                    </div>
                                    : null}
                            </div>
                            : null
                        }
                        {this.props.endtime ?
                            <div>
                                <div
                                    className="time-show"
                                    style={this.handleShowColor()}
                                    onClick={e => this.handleChangeEnd(e)}
                                >
                                    <p
                                        className="time-number"
                                    >{format('yyyy-MM-dd', this.props.endtime)}</p>
                                    <div className="try" style={{ display: this.state.showOverTime ? 'block' : 'none' }} />
                                    {this.state.showOverTime ?
                                        <div className="clender-setting" onClick={e => this.handlePop(e)}>
                                            <Calendar
                                                fullscreen={false}
                                                defaultValue={moment(this.props.endtime, 'YYYY-MM-DD')}
                                                onSelect={this.onPanellChange}
                                                disabledDate={this.disabledEndDate}
                                            />
                                            <button onClick={e => this.handleChangeEnd(e)}>取消</button>
                                        </div> : null}
                                </div>
                            </div> : null
                        }
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', width: '172px' }}>
                            {this.props.activeL ?
                                <div className="talk-show">
                                    <Icon icon="icon-xiaoxi1" iconColor="#bdbdbd" size={17} />
                                    <p className="talk-number">{this.props.activeL} </p>
                                </div> : null
                            }
                            {this.props.TaskLength ?
                                <div >
                                    {this.props.taskOver < this.props.TaskLength ?
                                        <div className="talk-show list-show">
                                            <Icon icon="icon-squarecheck" iconColor="#bdbdbd" size={20} />
                                            <div className="talk-number" style={{ display: 'flex' }}>
                                                <p>{this.props.taskOver}</p>
                                                <p>/</p>
                                                <p >{this.props.TaskLength} </p>
                                            </div>
                                        </div> : <div className="talk-show list-show list-color">
                                            <Icon icon="icon-squarecheck icon" size={20} />
                                            <div className="talk-number" style={{ display: 'flex' }}>
                                                <p>{this.props.taskOver}</p>
                                                <p>/</p>
                                                <p >{this.props.TaskLength} </p>
                                            </div>
                                        </div>}
                                </div> : null}
                            {this.props.files.length > 0 ?
                                <div className="talk-show list-show" style={{ marginLeft: '46px' }}>
                                    <Icon icon="icon-fujian1" iconColor="#bdbdbd" size={20} />
                                </div> : null}
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%' }}>
                            <Avatar
                                avatarColor={this.props.avatarColor}
                                name={this.props.name}
                                avatar={this.props.avatar}
                            />
                        </div>
                    </div>
                    <Modal
                        visible={this.state.visible}
                        footer={null}
                        onCancel={this.hideModal}
                        onOk={this.hideModal}
                        width="26.25rem"
                        style={{ top: 230, left: this.state.left + 234, boxShadow: 'none' }}
                        mask={this.state.mask}
                        className="Moal-reset"
                        bodyStyle={{ padding: 0 }}
                    >
                        <ProjectItemDetail
                            item={this.props.value}
                            Id={this.props.idIndex}
                            textId={this.props.textId}
                            projectId={this.props.projectId}
                            delete={this.props.deleteCard}
                            {...this.props}
                        />
                    </Modal>
                </div>
            </div >,
        );
    }
}

export default DragSource(ItemTypes.CARD, source, collect)(withTracker((taskid) => {
    Meteor.subscribe('active');
    Meteor.subscribe('task');
    Meteor.subscribe('users');
    Meteor.subscribe('tasklist');
    const activeL = Active.find({ taskId: taskid.idIndex }).fetch().length;
    const tasks = Task.find({ _id: taskid.idIndex }).fetch();
    const TaskLength = TaskList.find({ $and: [{ textId: taskid.textId }, { fatherId: { $ne: '' } }] }).fetch().length;
    const taskOver = TaskList.find({ $and: [{ textId: taskid.textId }, { fatherId: { $ne: '' } }, { checkble: 1 }] }).fetch().length;
    if (tasks.length !== 0) {
        const begintime = tasks[0].beginTime;
        const endtime = tasks[0].endTime;
        const label = tasks[0].label;
        const files = tasks[0].fileId;
        const memberId = tasks[0].memberId;
        const { profile = {} } = Meteor.users.findOne({ _id: memberId }) || {};
        const { name = '', avatarColor = '', avatar = '' } = profile;
        return {
            begintime,
            name,
            avatar,
            avatarColor,
            activeL,
            endtime,
            label,
            TaskLength,
            taskOver,
            files,
            memberId,
        };
    }
})(MiniCard));
