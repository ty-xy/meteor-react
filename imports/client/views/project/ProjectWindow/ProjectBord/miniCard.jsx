import React, { Component } from 'react';
import { Modal, Calendar } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
// import format from 'date-format';

import pureRender from 'pure-render-decorator';
import TaskList from '../../../../../../imports/schema/taskList';
import ProjectItemDetail from './projectItemDetail';
import Task from '../../../../../../imports/schema/task';
import Active from '../../../../../../imports/schema/active';
import Icon from '../../../../components/Icon';
// import eventUtil from '../../../../../util/eventUtil';

@pureRender
class MiniCard extends Component {
    static propTypes = {
        value: PropTypes.string,
        idIndex: PropTypes.string,
        begintime: PropTypes.string,
        activeL: PropTypes.number,
        endtime: PropTypes.string,
        label: PropTypes.string,
        index: PropTypes.string,
        ind: PropTypes.number,
        textId: PropTypes.string,
        deleteCard: PropTypes.func,
        projectId: PropTypes.string,
        TaskLength: PropTypes.number,
        taskOver: PropTypes.number,
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
    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
    }
    onPanelChange=(value) => {
        console.log(value.format('L'));
        Meteor.call(
            'changeTime', this.props.idIndex, value.format('L'),
            (err) => {
                console.log(err);
            },
        );
        this.setState({
            showStartTime: !this.state.showStartTime,
        });
    }
    onPanellChange=(value) => {
        console.log(value.format('L'));
        Meteor.call(
            'changeEndTime', this.props.idIndex, value.format('L'),
            (err) => {
                console.log(err);
            },
        );
        this.setState({
            showOverTime: !this.state.showOverTime,
        });
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
            left: e.target.offsetLeft,
        });
    }
    handleChangeStart =(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showStartTime: !this.state.showStartTime,
        });
        // eventUtil.addEvent(document, 'click', this.closeMenu);
    }
    handleChangeEnd =(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showOverTime: !this.state.showOverTime,
        });
    }
    render() {
        console.log(this.state.left);
        console.log(this.props.idIndex);
        console.error('循环到', this.props.value);
        return (
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
                        <p>{this.props.value}</p>
                        {this.props.label ? <p className="label-show" style={{ background: this.props.label }} /> : null}
                    </div>
                    <div className="try-stop" style={{ display: 'flex' }}>
                        {this.props.begintime ?
                            <div className="time-show" onClick={e => this.handleChangeStart(e)}>
                                <Icon icon="icon-qingjiaicon" />
                                <p className="time-number">{this.props.begintime}</p>
                                <div className="try" style={{ display: this.state.showStartTime ? 'block' : 'none' }} />
                                {this.state.showStartTime ?
                                    <div className="clender-setting" onClick={e => this.handlePop(e)}>
                                        <Calendar fullscreen={false} onSelect={this.onPanelChange} />
                                        <button onClick={e => this.handleChangeStart(e)}>取消</button>
                                    </div>
                                    : null}
                            </div>
                            : null
                        }
                        {this.props.endtime ?
                            <div>
                                <div className="time-show" onClick={e => this.handleChangeEnd(e)}>
                                    <Icon icon="icon-qingjiaicon" />
                                    <p className="time-number">{this.props.endtime}</p>
                                    <div className="try" style={{ display: this.state.showOverTime ? 'block' : 'none' }} />
                                    {this.state.showOverTime ?
                                        <div className="clender-setting" onClick={e => this.handlePop(e)}>
                                            <Calendar fullscreen={false} onSelect={this.onPanellChange} />
                                            <button onClick={e => this.handleChangeEnd(e)}>取消</button>
                                        </div> : null}
                                </div>
                            </div> : null
                        }
                    </div>
                    <div style={{ display: 'flex' }}>
                        {this.props.activeL ?
                            <div className="talk-show">
                                <Icon icon="icon-xiaoxi1" />
                                <p className="talk-number">{this.props.activeL} </p>
                            </div> : null
                        }
                        {this.props.TaskLength ?
                            <div >
                                {this.props.taskOver < this.props.TaskLength ?
                                    <div className="talk-show list-show">
                                        <Icon icon="icon-squarecheck" />
                                        <div className="talk-number" style={{ display: 'flex' }}>
                                            <p>{this.props.taskOver}</p>
                                            <p>/</p>
                                            <p >{this.props.TaskLength} </p>
                                        </div>
                                    </div> : <div className="talk-show list-show list-color">
                                        <Icon icon="icon-squarecheck icon" />
                                        <div className="talk-number" style={{ display: 'flex' }}>
                                            <p>{this.props.taskOver}</p>
                                            <p>/</p>
                                            <p >{this.props.TaskLength} </p>
                                        </div>
                                    </div>}
                            </div> : null}
                    </div>
                    <Modal
                        visible={this.state.visible}
                        footer={null}
                        onCancel={this.hideModal}
                        onOk={this.hideModal}
                        width="26.25rem"
                        style={{ top: 220, left: this.state.left + 37, boxShadow: 'none' }}
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
                        />
                    </Modal>
                </div>
            </div >
        );
    }
}

export default withTracker((taskid) => {
    Meteor.subscribe('active');
    Meteor.subscribe('task');
    Meteor.subscribe('tasklist');
    const activeL = Active.find({ taskId: taskid.idIndex }).fetch().length;
    const tasks = Task.find({ _id: taskid.idIndex }).fetch();
    const TaskLength = TaskList.find({ $and: [{ textId: taskid.textId }, { fatherId: { $ne: '' } }] }).fetch().length;
    const taskOver = TaskList.find({ $and: [{ textId: taskid.textId }, { fatherId: { $ne: '' } }, { checkble: 1 }] }).fetch().length;
    if (tasks.length !== 0) {
        const begintime = tasks[0].beginTime;
        const endtime = tasks[0].endTime;
        const label = tasks[0].label;
        return {
            begintime,
            activeL,
            endtime,
            label,
            TaskLength,
            taskOver,
        };
    }
})(MiniCard);
