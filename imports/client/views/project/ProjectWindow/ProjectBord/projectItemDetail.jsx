import React, { Component } from 'react';
import { Row, Col, Calendar, Menu, Dropdown, Checkbox, Tooltip, Tag, DatePicker } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import format from 'date-format';
import moment from 'moment';
import pureRender from 'pure-render-decorator';

import Icon from '../../../../components/Icon';
import ProjectInput from './projectInput';
import Task from '../../../../../../imports/schema/task';
import File from '../../../../../../imports/schema/file';
import TaskList from '../../../../../../imports/schema/taskList';
import feedback from '../../../../../util/feedback';
import ProjectCopy from './ProjectCopy';
import TaskBoard from '../../../../../../imports/schema/taskBoard';
import ProjectTaskMember from './projectTaskMember';
import ProjectActive from './projectActive';
import FileIcon from '../../../../components/FileIcon';

@pureRender
class ProjectItemDetail extends Component {
    static propTypes = {
        item: PropTypes.string, // 传送项目
        Id: PropTypes.object, //
        index: PropTypes.string,
        textId: PropTypes.string,
        tasks: PropTypes.arrayOf(PropTypes.object),
        delete: PropTypes.func,
        cancel: PropTypes.func,
        tasklists: PropTypes.arrayOf(PropTypes.object),
        taskchild: PropTypes.arrayOf(PropTypes.object),
        iddd: PropTypes.array,
        cId: PropTypes.array,
        files: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.string,
        ]),
        projectId: PropTypes.string,
        memberId: PropTypes.string,
    }
    constructor(...props) {
        super(...props);
        this.state = {
            shown: false,
            shownT: false,
            shownR: true,
            tValue: '',
            titleValue: '',
            time: '', // 开始的时间
            endtime: '', // 结束的时间
            visible: false, // 模态框可见
            visiblel: false,
            mask: false, // 不要模态款
            checkValue: '', // 检查值
            listValue: '',
            visib: false, // 子菜单的值
            number: 0,
            titleShow: true,
            isShowAccount: false,
            showBegin: false,
            showEnd: false,
            uuids: '',
            showCopyCard: false,
            overNumber: 0,
            checked: true,
            FlistValue: '',
            TtitleValue: '',
        };
    }
    componentWillMount() {
        this.setState({
            uuids: uuid.v4(),
            titleValue: this.props.item,
        });
    }
    componentDidMount() {
        console.log(this.state.uuids);
    }
    componentWillReceiveProps() {
        this.setState({
            uuids: uuid.v4(),
            titleValue: this.props.item,
        });
    }
    onPanelChange = (value) => {
        this.creatTime('changeTime', value);
    }
    onPanellChange = (value) => {
        this.creatTime('changeEndTime', value);
    }
    onSelectChange = (value) => {
        this.onPanelChange(value);
        this.setState({
            showBegin: !this.state.showBegin,
        });
    }
    onEndChange = (value) => {
        this.onPanellChange(value);
        this.handleEnd();
    }
    creatTime = (func, value) => {
        Meteor.call(
            `${func}`, this.props.Id.Id, value._d,
            (err) => {
                console.log(err);
            },
        );
    }
    disabledEndDate = (endValue) => {
        const startValue = this.props.tasks[0].beginTime;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    handleStart =() => {
        this.setState({
            showBegin: !this.state.showBegin,
        });
    }
    handleEnd = () => {
        this.setState({
            showEnd: !this.state.showEnd,
        });
    }
    handleChangeEnd = () => {
        this.handleEnd();
    }
    handleChangeStart=() => {
        this.handleStart();
    }
    showOk = () => {
        this.setState({
            visiblel: true,
        });
    }
    handleOk = () => {
        this.setState({
            visiblel: false,
        });
    }
    handleCancel = () => {
        this.handleOk();
    }
    // 创建任务表单
    handleChangeS = () => {
        this.createTask();
        this.handleClose();
    }
    handleChangeSs=() => {
        this.createTask();
    }
    // 评论框变化获得值
    handleChangeR = () => {
        this.setState({
            shownR: !this.state.shownR,
        });
    }
    // checkbox的状态值
    handleChange = (e, id) => {
        if (e.target.checked === true) {
            Meteor.call(
                'changeCheckble', id, 1, (err) => {
                    console.log(err);
                },
            );
        } else if (e.target.checked === false) {
            Meteor.call(
                'changeCheckble', id, 0, (err) => {
                    console.log(err);
                },
            );
        }
    }
    handleChangeTry=(name, e) => {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
    }
    // 调用创建活动的方法
    // 创建清单表
    createTaskList = () => {
        Meteor.call(
            'createTaskList', {
                name: this.state.checkValue,
                taskId: this.props.Id.Id,
                textId: this.props.Id.textId,
                fatherId: '',
                listId: uuid.v4(),
            },
            (err) => {
                console.log(err);
            },
        );
    }
    // 调用创建清单的方法
    handleChangeCheck = () => {
        this.createTaskList();
        this.setState({
            checkValue: '',
        });
        this.setState({
            shownR: !this.state.shownR,
        });
        console.log(1111);
    }
    // 创建任务的方法
    createTask = () => {
        Meteor.call(
            'changeTask', this.props.Id.Id, this.state.tValue.replace(/\n|\r\n/g, '<br/>'),
            (err) => {
                console.log(err);
            },
        );
    }
    // 更改头部的值
    handleTitle = () => {
        this.setState({
            titleShow: !this.state.titleShow,
        });
    }
    handleTitleT = () => {
        this.handleTitle();
        this.setState({
            titleValue: this.props.item,
        });
    }
    handleChangeTitleQ = () => {
        Meteor.call(
            'changeName', this.props.Id.Id, this.state.titleValue.replace(/\n|\r\n/g, '<br/>'),
            (err) => {
                console.log(err);
            },
        );
        this.setState({
            titleShow: !this.state.titleShow,
            titleValue: '',
        });
    }
    handleClose = () => {
        this.setState({
            shown: !this.state.shown,
        });
    }
    // 删除上传文件
    handleRemoveFile=(id) => {
        Meteor.call(
            'deleteFile', this.props.Id.Id, id, (err) => {
                console.log(err);
            },
        );
    }
    // 显示清单子菜单
    handldetaskList = (id) => {
        this.setState({
            [`shownT${id}`]: true,
        });
    }
    handleSendTaskList = (id) => {
        this.setState({
            [`shownT${id}`]: false,
            listValue: '',
        });
        Meteor.call(
            'createTaskList', {
                name: this.state.listValue,
                taskId: this.props.Id.Id,
                textId: this.props.Id.textId,
                fatherId: id,
                listId: uuid.v4(),
            },
            (err) => {
                console.log(err);
            },
        );
    }
    // 删除清单
    handleRemoveList = (id) => {
        Meteor.call(
            'removeTaskList', id, (err) => {
                console.log(err);
            },
        );
    }
    handleRList = (id) => {
        feedback.dealDelete('提示', '确定要删除该清单吗?', () => this.handleRemoveList(id));
    }
    handleOrder =(array) => {
        Meteor.call(
            'changeTaskId', this.props.index, array, (err) => {
                console.log(err);
            },
        );
    }

    handleColor = (event) => {
        const number = event.currentTarget.getAttribute('data-color');
        const taskAarray = TaskBoard.find({ _id: this.props.index }).fetch();
        const taskSort = taskAarray[0].sortArray;
        const index = taskSort.indexOf(this.props.textId);
        if (number === '#ef5350') {
            taskSort.unshift(this.props.textId);
            taskSort.splice(index + 1, 1);
            this.handleOrder(taskSort);
        }
        Meteor.call(
            'changeLabel', this.props.Id.Id, number, (err) => {
                console.log(err);
            },
        );
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
        const reader = new FileReader();
        const name = file.name;
        const fileType = file.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = file.size;
        const changeFileId = this.changeFileId;

        reader.onloadend = function () {
            Meteor.call('insertFile', name, type, size, this.result, (err, res) => {
                feedback.dealError(err);
                if (res) {
                    console.log(res);
                    changeFileId(res);
                }
            });
        };
        reader.readAsDataURL(file);
    }
    changeFileId = (fileId) => {
        Meteor.call(
            'changeFileId', this.props.Id.Id, fileId,
            (err) => {
                feedback.dealError(err);
                console.log(err);
            });
    }
    // 复制卡片
    handleCopy = (v) => {
        console.log(v);
        const task = this.props.tasks[0];
        console.log(task);
        Meteor.call(
            'createTask',
            { name: task.name,
                taskBoardId: task.taskBoardId,
                textId: this.state.uuids,
                memberId: Meteor.userId(),
            },
            (err) => {
                console.log(err);
            },
        );
        Meteor.call('changeSortAarry', v, this.state.uuids, (err) => {
            console.log(err);
        },
        );
        Meteor.call(
            'repeatTask',
            this.state.uuids,
            task.describe,
            task.beginTime,
            task.endTime,
            task.label,
            (err) => {
                console.log(err);
            },
        );
        this.props.tasklists.map((value) => {
            console.log(value);
            if (value) {
                const ude = uuid.v4();
                Meteor.call(
                    'createTaskList',
                    {
                        name: value.name,
                        taskId: task.taskBoardId,
                        textId: this.state.uuids,
                        fatherId: '',
                        listId: ude,
                    },
                    (err) => {
                        console.log(err);
                    },
                );
                this.props.taskchild.map((item) => {
                    if (item.fatherId === value.listId) {
                        return Meteor.call(
                            'createTaskList',
                            {
                                name: item.name,
                                taskId: task.taskBoardId,
                                textId: this.state.uuids,
                                fatherId: ude,
                                listId: uuid.v4(),
                            },
                            (err) => {
                                console.log(err);
                            },
                        );
                    }
                    return null;
                });
            }
            return null;
        });
        this.handleCopys();
    }
    handleCopys=() => {
        this.setState({
            showCopyCard: !this.state.showCopyCard,
        });
    }
    handleCop = () => {
        this.setState({
            showCopyCard: false,
        });
    }
    handleTaskList = (id, item) => {
        this.setState({
            [`showList${id}`]: true,
            TtitleValue: item,
        });
    }
    handleTaskListC =(id) => {
        this.setState({
            [`showList${id}`]: false,
        });
    }
    handleChangeTTitle =(id, value) => {
        Meteor.call(
            'changeTaskList', id, this.state.TtitleValue || value, (err) => {
                console.log(err);
            },
        );
        this.setState({
            TtitleValue: '',
        });
        this.handleTaskListC(id);
    }
    handleClick=(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    // 时间函数
    handleShowColor =() => {
        const time = Math.ceil((this.props.tasks[0].endTime - new Date()) / 1000 / 3600 / 24);
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
    handleSendFList =(id, value) => {
        Meteor.call(
            'changeTaskList', id, this.state.FlistValue || value, (err) => {
                console.log(err);
            },
        );
        this.handleCancelF(id);
    }
    handleFlist =(id, item) => {
        this.setState({
            [`fatherList${id}`]: true,
            FlistValue: item,
        });
    }
    handleCancelF =(id) => {
        this.setState({
            [`fatherList${id}`]: false,
        });
    }
    handleDeleteC =(id) => {
        this.handleRemoveList(id);
    }
    handleRTaskList =(id) => {
        this.setState({
            [`shownT${id}`]: false,
        });
    }
    handleSendMessage = (e, func) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            func();
        }
    }
    // 渲染子清单
    renderTasks = (id) => {
        console.log();
        return this.props.taskchild.map((listChild) => {
            if (listChild.fatherId === id) {
                return (
                    <div key={listChild._id}>
                        {!this.state[`showList${listChild.listId}`] ?
                            <div
                                style={{ marginLeft: '20px', display: 'flex' }}
                                onClick={() => this.handleTaskList(listChild.listId, listChild.name)}
                            >
                                <Checkbox
                                    onClick={e => this.handleClick(e)}
                                    onChange={e => this.handleChange(e, listChild.listId)}
                                    checked={listChild.checkble === 1 ? this.state.checked : !this.state.checked}
                                    dataId={listChild.fatherId}
                                />
                                <p
                                    style={{ marginLeft: '8px' }}
                                >{listChild.name}</p>
                            </div> :
                            <div
                                style={{ display: 'flex' }}
                                onClick={() => this.handleTaskListC(listChild.listId)}
                            >
                                <div className="try try-out" style={{ display: this.state[`showList${listChild.listId}`] ? 'block' : 'none' }} />
                                <ProjectInput
                                    input="更改"
                                    onPop={e => this.handleClick(e)}
                                    onClick={() => this.handleChangeTTitle(listChild.listId, listChild.name)}
                                    value={this.state.TtitleValue}
                                    onKeyDown={e => this.handleSendMessage(e, () => this.handleChangeTTitle(listChild.listId, listChild.name))}
                                    onChange={e => this.handleChangeTry('TtitleValue', e)}
                                    onConcel={() => this.handleTaskListC(listChild.listId)}
                                />
                                <p
                                    style={{ marginLeft: '45px',
                                        marginTop: '20px',
                                        zIndex: 2000,
                                        position: 'relative' }}
                                    onClick={() => this.handleDeleteC(listChild.listId)}
                                >删除</p>
                            </div>
                        }
                    </div>
                );
            }
            return null;
        });
    }
    // 开始渲染
    render() {
        const menu = (
            <Menu >
                <Menu.Item key="1">
                    <p onClick={this.handleTitle}>编辑名称</p>
                </Menu.Item>
                {Meteor.userId() === this.props.memberId ?
                    <Menu.Item key="0">
                        <p onClick={this.props.delete}>删除</p>
                    </Menu.Item> : null}
                <Menu.Divider />
                <Menu.Item key="10">
                    <p onClick={this.handleCopys}>复制卡片</p>
                </Menu.Item>
            </Menu>
        );
        const menuL = (
            <Menu className="change-modal tag-show">
                <Menu.Item key="0" className="tag-li-show">
                    <Row>
                        <Col span={20}>
                            <div className="tag-title">优先级</div>
                        </Col>
                        <Col span={4}>
                            <Icon icon="icon-guanbi1 icon" onClick={this.handleOk} />
                        </Col>
                    </Row>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3" className="tag-li-show">
                    <div
                        data-color={'#d8d8d8'}
                        onClick={this.handleColor}
                    >
                        <Tag
                            color="#d8d8d8"
                            className="label-circle"

                        />
                          正常
                        {(this.props.tasks[0] && this.props.tasks[0].label === '#d8d8d8') || (this.props.tasks[0] && this.props.tasks[0].label) === '' ?
                            <Icon icon="icon-xuanze icon-right" /> : null}

                    </div>
                </Menu.Item>
                <Menu.Item key="1" className="tag-li-show">
                    <div
                        data-color={'#F3b152'}
                        onClick={this.handleColor}
                    >
                        <Tag
                            color="#F3b152"
                            className="label-circle"
                            data-color={'#F3b152'}
                            onClick={this.handleColor}
                        />
                                                紧急
                        { this.props.tasks[0] && this.props.tasks[0].label === '#F3b152' ?
                            <Icon icon="icon-xuanze icon-right" /> : null}
                    </div>
                </Menu.Item>
                <Menu.Item key="2" className="tag-li-show">
                    <div
                        data-color={'#ef5350'}
                        onClick={this.handleColor}
                    >
                        <Tag
                            color="#ef5350"
                            className="label-circle"
                        />
                                                 非常紧急
                        { this.props.tasks[0] && this.props.tasks[0].label === '#ef5350' ?
                            <Icon icon="icon-xuanze icon-right" /> : null}
                    </div>
                </Menu.Item>
            </Menu>
        );
        // console.log(this.props.cancel);
        return (
            <div className="ejian-lian-project-detail">
                <div className="detail-title detail-common">
                    <Row>
                        <Col span={20}>
                            {this.state.titleShow ?
                                <h1 onClick={this.handleTitle} dangerouslySetInnerHTML={{ __html: this.props.item }} />
                                :
                                <div onClick={this.handleTitle} >
                                    <div className="try try-out" style={{ display: !this.state.titleShow ? 'block' : 'none' }} />
                                    <ProjectInput
                                        input="更改"
                                        onClick={this.handleChangeTitleQ}
                                        onPop={e => this.handleClick(e)}
                                        onKeyDown={e => this.handleSendMessage(e, this.handleChangeTitleQ)}
                                        defaultvalue={this.props.item}
                                        value={this.state.titleValue}
                                        onChange={e => this.handleChangeTry('titleValue', e)}
                                        onConcel={this.handleTitleT}
                                    />
                                </div>}
                        </Col>
                        <Col span={2} onClick={this.handleCop} style={{ textAlign: 'center' }}>
                            <div className="try try-out" style={{ display: this.state.showCopyCard ? 'block' : 'none' }} />
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon icon="icon-gengduo1" iconColor="#999" size={16} />
                            </Dropdown>
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            <Icon icon="icon-guanbi" iconColor="#999" size={16} onClick={this.props.cancel} />
                        </Col>
                    </Row>
                </div>
                <div className="modal-detail-content detail-common">
                    <div className="detail-list-common">
                        <ProjectTaskMember projectId={this.props.projectId}{...this.props} />
                        <div className="detail-list-content-top">
                            <p>优先级</p>
                            <div style={{ display: 'flex' }}>
                                <Tooltip title="点击切换" placement="top">
                                    <Dropdown overlay={menuL} trigger={['click']} className="change-modal">
                                        <p
                                            className="circle-icon-l"
                                            onClick={this.showOk}
                                            style={{ background: this.props.tasks[0] && this.props.tasks[0].label ? this.props.tasks[0].label : '#d8d8d8' }}
                                        />
                                    </Dropdown>
                                </Tooltip>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }} className="detail-list-content-top">
                            <div className="detail-time-start">
                                <p >开始</p>
                                {this.props.tasks[0] && this.props.tasks[0].beginTime ?
                                    <div onClick={this.handleStart}>
                                        <div className="start-time" onClick={this.handleStart}>
                                            {format('yyyy年MM月dd日', this.props.tasks[0].beginTime)}
                                        </div>
                                        {<div className="try" style={{ display: this.state.showBegin ? 'block' : 'none' }} />}
                                    </div>
                                    :
                                    <div className="none-time">
                                        <DatePicker
                                            placeholder=" 设置开始时间"
                                            onChange={this.onPanelChange}
                                        />
                                    </div>
                                }
                            </div>
                            <div>
                                <p >结束</p>
                                {this.props.tasks[0] && this.props.tasks[0].endTime ?
                                    <div onClick={this.handleChangeEnd}>
                                        <div
                                            className="start-time"
                                            onClick={this.handleEnd}
                                            style={this.handleShowColor()}
                                        >
                                            {format('yyyy年MM月dd日', this.props.tasks[0].endTime)}
                                        </div>
                                        <div className="try" style={{ display: this.state.showEnd ? 'block' : 'none' }} />
                                    </div>
                                    :
                                    <div className="none-time">
                                        <DatePicker
                                            placeholder=" 设置结束时间"
                                            disabledDate={this.disabledEndDate}
                                            onChange={this.onPanellChange}
                                        />
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="detail-list-common detail-list-decription">
                        <p className="title-common-detail">
                            描述
                        </p>
                        {
                            this.state.shown ?
                                <div onClick={e => this.handleClose(e)} className="input-detail-miaoshu">
                                    <div className="try try-out" style={{ display: this.state.shown ? 'block' : 'none' }} />
                                    <ProjectInput
                                        input="编辑"
                                        onClick={this.handleChangeS}
                                        onPop={e => this.handleClick(e)}
                                        onKeyDown={e => this.handleSendMessage(e, this.handleChangeS)}
                                        value={this.state.tValue}
                                        onChange={e => this.handleChangeTry('tValue', e)}
                                        onConcel={this.handleClose}
                                    />
                                </div>
                                :
                                <div className="ready-task">
                                    {this.props.tasks[0] && this.props.tasks[0].describe ?
                                        <div
                                            /* ／*type="button"*／ */
                                            dangerouslySetInnerHTML={{ __html: this.props.tasks[0].describe }}
                                            className="input-decription"
                                            onClick={this.handleChangeS}
                                        /> : <ProjectInput
                                            input="编辑"
                                            onClick={this.handleChangeSs}
                                            onPop={e => this.handleClick(e)}
                                            onKeyDown={e => this.handleSendMessage(e, this.handleChangeS)}
                                            value={this.state.tValue}
                                            onChange={e => this.handleChangeTry('tValue', e)}
                                            bool={false}
                                            Top={10}
                                        />}
                                </div>
                        }
                    </div>
                    <div className="detail-list-common">
                        <p className="title-common-detail">清单</p>
                        {this.props.tasklists.map((tasklist, index) => (
                            <div key={tasklist._id} >
                                {!this.state[`fatherList${tasklist.listId}`] ?
                                    <Row>
                                        <Col
                                            span={19}
                                            style={{ display: 'flex' }}
                                            onClick={() => this.handleFlist(tasklist.listId, tasklist.name)}
                                        >
                                            <Icon icon="icon-squarecheck" />
                                            <p className="qingdan-name">{tasklist.name}</p>
                                        </Col>
                                        <Col span={2}>
                                            <span>{this.props.cId[index]}</span>
                                            <span>/</span>
                                            <span>{this.props.iddd[index]}</span>
                                        </Col>
                                        <Col span={3} onClick={() => this.handleRList(tasklist.listId)}>
                                        删除
                                        </Col>
                                    </Row> :
                                    <div
                                        onClick={() => this.handleCancelF(tasklist.listId)}
                                    >
                                        <div className="try try-out" style={{ display: this.state[`fatherList${tasklist.listId}`] ? 'block' : 'none' }} />
                                        <ProjectInput
                                            input="添加"
                                            value={this.state.FlistValue}
                                            onPop={e => this.handleClick(e)}
                                            onKeyDown={e => this.handleSendMessage(e, () => this.handleSendFList(tasklist.listId, tasklist.name))}
                                            onChange={e => this.handleChangeTry('FlistValue', e)}
                                            onConcel={() => this.handleCancelF(tasklist.listId)}
                                            onClick={() => this.handleSendFList(tasklist.listId, tasklist.name)}
                                        />
                                    </div>
                                }
                                {this.renderTasks(tasklist.listId, index)}
                                <div style={{ marginLeft: '20px' }}>
                                    {this.state[`shownT${tasklist.listId}`] ?
                                        <div onClick={() => this.handleRTaskList(tasklist.listId)}>
                                            <div className="try try-out" style={{ display: this.state[`shownT${tasklist.listId}`] ? 'block' : 'none' }} />
                                            <ProjectInput
                                                input="添加"
                                                value={this.state.listValue}
                                                onPop={e => this.handleClick(e)}
                                                onKeyDown={e => this.handleSendMessage(e, () => this.handleSendTaskList(tasklist.listId))}
                                                onChange={e => this.handleChangeTry('listValue', e)}
                                                onClick={() => this.handleSendTaskList(tasklist.listId)}
                                                onConcel={() => this.handleRTaskList(tasklist.listId)}
                                            />
                                        </div> :
                                        <p onClick={() => this.handldetaskList(tasklist.listId)} className="ready-task">
                                            <Icon icon="icon-jiahao icon-add" size={18} iconColor="#bdbdbd" />
                                            扩充清单
                                        </p>
                                    }
                                </div>
                            </div>
                        ))
                        }
                        {this.state.shownR ?
                            <p className="ready-task" onClick={this.handleChangeR}>
                                <Icon icon="icon-jiahao icon-add" size={18} iconColor="#bdbdbd" />
                                添加待办事项
                            </p> :
                            <div
                                onClick={this.handleChangeR}
                            >
                                <div className="try try-out" style={{ display: !this.state.shownR ? 'block' : 'none' }} />
                                <ProjectInput
                                    input="添加"
                                    value={this.state.checkValue}
                                    onPop={e => this.handleClick(e)}
                                    onKeyDown={e => this.handleSendMessage(e, this.handleChangeCheck)}
                                    onChange={e => this.handleChangeTry('checkValue', e)}
                                    onClick={this.handleChangeCheck}
                                    onConcel={this.handleChangeR}
                                />
                            </div>
                        }
                    </div>
                    <div>
                        <div>
                            <Row>
                                <Col span={18}>
                                    <p className="title-common-detail">添加附件</p>
                                </Col>
                                <Col span={3}>
                                    <Icon
                                        icon="icon-fujian1"
                                        size={20}
                                        iconColor="#bdbdbd"
                                        onClick={this.sendFile}
                                    />
                                    <input
                                        className="input-file"
                                        type="file"
                                        ref={i => this.fileInput = i}
                                        onChange={this.selectFile}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Icon
                                        icon="icon-biaodan1"
                                        size={20}
                                        iconColor="#bdbdbd"
                                    />
                                </Col>
                            </Row>
                        </div>
                        {this.props.files.length > 0 ?
                            <div>{
                                this.props.files.map(value => (
                                    <Row key={value._id}>
                                        <Col style={{ display: 'flex' }} span={13} >
                                            <Col span={2}>
                                                <FileIcon type={value.type} />
                                            </Col>
                                            <Col span={11} style={{ marginLeft: '10px' }}>
                                                <p >
                                                    {value.name.slice(0, 8)}
                                                </p>
                                            </Col>
                                            <Col span={5} style={{ textAlign: 'center' }}><p>{value.size}</p></Col>
                                        </Col>
                                        <Col span={3} >
                                            <a href={value.url} download={value.name} style={{ color: '#6f6f6f' }}>下载</a>
                                        </Col>
                                        <Col span={3} onClick={() => this.handleRemoveFile(value._id)}>删除</Col>
                                        <Col span={5}>{format('MM月dd日', value.createdAt)}</Col>
                                    </Row>))}</div> : null}
                    </div>
                    <ProjectActive {...this.props} />
                </div>
                {this.state.showEnd ?
                    <div className="clender-setting  clender-setting-more clender-over" >
                        <Calendar
                            fullscreen={false}
                            defaultValue={moment(this.props.tasks[0].endTime, 'YYYY-MM-DD')}
                            onSelect={this.onEndChange}
                            disabledDate={this.disabledEndDate}
                        />
                        <button onClick={e => this.handleChangeEnd(e)}>取消</button>
                    </div> : null}
                {this.state.showBegin ?
                    <div className="clender-setting  clender-setting-more" >
                        <Calendar
                            fullscreen={false}
                            defaultValue={moment(this.props.tasks[0].beginTime, 'YYYY-MM-DD')}
                            onSelect={this.onSelectChange}
                        />
                        <button onClick={e => this.handleChangeStart(e)}>取消</button>
                    </div> : null}
                {this.state.showCopyCard ?
                    <ProjectCopy
                        hidden={this.handleCop}
                        title={this.props.item}
                        projectId={this.props.projectId}
                        Cclick={this.handleCopy}
                    /> : null
                }
            </div >

        );
    }
}
export default withTracker((Id) => {
    Meteor.subscribe('task');
    Meteor.subscribe('users');
    Meteor.subscribe('tasklist');
    Meteor.subscribe('taskboard');
    Meteor.subscribe('files');
    const tasks = Task.find({ _id: Id.idIndex }).fetch();
    const tasklists = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: '' }] }).fetch();
    const taskchild = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: { $ne: '' } }] }).fetch();
    const idd = tasklists.map((id) => {
        const length = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: id.listId }] }).fetch();
        return length;
    });
    const checkId = tasklists.map((id) => {
        const length = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: id.listId }, { checkble: 1 }] }).fetch();
        return length;
    });
    const iddd = idd.map(element => (element.length));
    const cId = checkId.map(element => (element.length));
    return {
        Id,
        tasklists,
        taskchild,
        iddd,
        cId,
        checkId,
        tasks,
        files: tasks[0] && tasks[0].fileId.length > 0 ? File.find({ _id: { $in: tasks[0].fileId } }).fetch() : '',
    };
})(ProjectItemDetail);

