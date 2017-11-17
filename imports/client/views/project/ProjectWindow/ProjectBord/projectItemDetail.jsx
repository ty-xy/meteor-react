import React, { Component } from 'react';
import { Row, Col, Input, Calendar, Menu, Dropdown, Checkbox, Modal, Tooltip, Tag, DatePicker } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
// import format from 'date-format';
import uuid from 'uuid';
import format from 'date-format';
import pureRender from 'pure-render-decorator';
import AvatarSelf from '../../../../components/AvatarSelf';
import Icon from '../../../../components/Icon';
import ProjectInput from './projectInput';
import Task from '../../../../../../imports/schema/task';
import File from '../../../../../../imports/schema/file';
import TaskList from '../../../../../../imports/schema/taskList';
import Active from '../../../../../../imports/schema/active';
import feedback from '../../../../../util/feedback';
// import ProjectTag from './ProjectTag';

const { TextArea } = Input;
// const confirm = Modal.confirm;
@pureRender
class ProjectItemDetail extends Component {
    static propTypes = {
        item: PropTypes.string, // 传送项目
        Id: PropTypes.object, //
        tasks: PropTypes.arrayOf(PropTypes.object),
        // decription: PropTypes.string, // 描述的值
        activities: PropTypes.arrayOf(PropTypes.object),
        // begintime: PropTypes.string,
        // endtime: PropTypes.string,
        delete: PropTypes.func,
        tasklists: PropTypes.arrayOf(PropTypes.object),
        taskchild: PropTypes.arrayOf(PropTypes.object),
        // label: PropTypes.string,
        iddd: PropTypes.array,
        files: PropTypes.string,
    }
    constructor(...props) {
        super(...props);
        this.state = {
            shown: false,
            shownT: false,
            shownR: true,
            // shownCreadite: tru, // 显示编辑的
            tValue: '',
            titleValue: '',
            time: '', // 开始的时间
            endtime: '', // 结束的时间
            commentMark: '', //  评论的内容
            visible: false, // 模态框可见
            visiblel: false,
            mask: false, // 不要模态款
            checkValue: '', // 检查值
            changeMark: '',
            listValue: '',
            visib: false, // 子菜单的值
            number: 0,
            titleShow: true,
            isShowAccount: false,
            showBegin: false,
            showEnd: false,
            uuids: '',
        };
    }
    componentWillMount() {
        console.log('componentWillMount', this.props.tasklists);
        this.setState({
            uuids: uuid.v4(),
        });
    }
    componentDidMount() {
        console.log(this.state.uuids);
    }
    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        console.log(uuid.v4());
    }
    onPanelChange = (value) => {
        Meteor.call(
            'changeTime', this.props.Id.Id, value.format('L'),
            (err) => {
                console.log(err);
            },
        );
    }
    onPanellChange = (value) => {
        Meteor.call(
            'changeEndTime', this.props.Id.Id, value.format('L'),
            (err) => {
                console.log(err);
            },
        );
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
        // e.stopPropagation();
        // e.nativeEvent.stopImmediatePropagation();
        this.handleStart();
    }
    // showModal = () => {
    //     this.setState({
    //         visible: true,
    //     });
    // }
    showOk = () => {
        this.setState({
            visiblel: true,
        });
    }
    // showOver = () => {
    //     this.setState({
    //         visib: true,
    //     });
    // }
    // hideModal = () => {
    //     this.setState({
    //         visible: false,
    //     });
    // }
    // hideOver = () => {
    //     this.setState({
    //         visib: false,
    //     });
    // }
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
        console.log(this.props.Id);
    }
    // 评论框变化获得值
    handleChangeTT = (e) => {
        this.setState({
            commentMark: e.target.value,
        });
    }
    handleChangeMark = (e) => {
        this.setState({
            changeMark: e.target.value,
        });
    }
    handleChangeR = () => {
        this.setState({
            shownR: !this.state.shownR,
        });
    }
    // checkbox的状态值
    handleChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    }
    // 获得变化的值
    handleChangeT = (e) => {
        this.setState({
            tValue: e.target.value,
        });
        console.log(this.state.tValue);
    }
    // 设置清单的值
    handleCheck = (e) => {
        this.setState({
            checkValue: e.target.value,
        });
        console.log(this.state.checkValue);
    }
    // 调用创建活动的方法
    handleMark = () => {
        this.createActive();
        this.setState({
            commentMark: '',
        });
    }
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
    }
    // 创建任务的方法
    createTask = () => {
        console.log(this.props.Id);
        Meteor.call(
            'changeTask', this.props.Id.Id, this.state.tValue,
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
    handleChangeTitle = (e) => {
        this.setState({
            titleValue: e.target.value,
        });
    }
    handleChangeTitleQ = () => {
        Meteor.call(
            'changeName', this.props.Id.Id, this.state.titleValue,
            (err) => {
                console.log(err);
            },
        );
        this.setState({
            titleShow: !this.state.titleShow,
            titleValue: '',
        });
    }
    // 调用移除评论的活动 目前没有成功 ／／ 成功修改
    handleRemove = (id) => {
        // this.deleteActive(id);
        feedback.dealDelete('提示', '确定要删除该评论么?', () => this.deleteActive(id));
    }
    // 创建移除评论活动的方法
    deleteActive = (id) => {
        Meteor.call(
            'deleteActive', id, (err) => {
                console.log(err);
            },
        );
    }
    // 创建评论活动
    createActive = () => {
        console.log(this.state.commentMark);
        Meteor.call(
            'createActive',
            {
                content: this.state.commentMark,
                taskId: this.props.Id.Id,
            },
            (err) => {
                console.log(err);
            },
        );
    }
    // 显示编辑框
    showCreadite = (id) => {
        this.setState({
            [`shownCreadite${id}`]: true,
        });
    }
    // 编辑active
    handleCreadite = (id) => {
        // console.log(this.props.id)
        this.setState({
            [`shownCreadite${id}`]: false,
        });
        this.changActive(id);
    }
    // 改变活动
    changActive = (id) => {
        Meteor.call(
            'changeActive', id, this.state.changeMark, (err) => {
                console.log(err);
            },
        );
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
        console.log(this.list);
    }
    // 子菜单的编辑变化
    handldeChangetaskList = (e) => {
        this.setState({
            listValue: e.target.value,
        });
        console.log(this.state.listValue);
    }
    // 创建的子清单列表并调用
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
    handleColor = (event) => {
        const number = event.currentTarget.getAttribute('data-color');
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
    handleCopy = () => {
        const task = this.props.tasks[0];
        console.log(task);
        Meteor.call(
            'createTask',
            { name: task.name,
                taskBoardId: task.taskBoardId,
                textId: this.state.uuids,
            },
            (err) => {
                console.log(err);
            },
        );
        Meteor.call('changeSortAarry', task.taskBoardId, this.state.uuids, (err) => {
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
    }
    // 渲染子清单
    renderTasks = (id) => {
        console.log();
        return this.props.taskchild.map((listChild) => {
            if (listChild.fatherId === id) {
                return (
                    <div style={{ marginLeft: '20px' }} key={listChild._id} >
                        <Checkbox onChange={this.handleChange}>{listChild.name}</Checkbox>
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
                <Menu.Item key="0">
                    <p onClick={this.props.delete}>删除</p>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="10">
                    <p onClick={this.handleCopy}>复制卡片</p>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="ejian-lian-project-detail">
                <div className="detail-title detail-common">
                    <Row>
                        <Col span={20}>
                            {this.state.titleShow ?
                                <h1 onClick={this.handleTitle}>{this.props.item}</h1> :
                                <ProjectInput
                                    input="更改"
                                    onClick={this.handleChangeTitleQ}
                                    value={this.state.titleValue}
                                    onChange={this.handleChangeTitle}
                                    onConcel={this.handleTitle}
                                />}
                        </Col>
                        <Col span={4}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon icon="icon-gengduo1" />
                            </Dropdown>
                        </Col>
                    </Row>
                </div>
                <div className="modal-detail-content detail-common">
                    <Row className="detail-list-common">
                        <Col span={5}>
                            <p>成员</p>
                            <div style={{ display: 'flex' }}>
                                <div className="person-size">
                                    <AvatarSelf />
                                </div>
                                <Icon icon="icon-tianjia circle-icon" />
                            </div>
                        </Col>
                        <Col span={5}>
                            <p>标签</p>
                            <div style={{ display: 'flex' }}>
                                <Tooltip title="点击切换" placement="top">
                                    <p className="circle-icon-l" onClick={this.showOk} style={{ background: this.props.tasks[0] && this.props.tasks[0].label ? this.props.tasks[0].label : '#7ED321' }} />
                                </Tooltip>
                                <Modal
                                    visible={this.state.visiblel}
                                    onOk={this.handleOk}
                                    width={174}
                                    footer={null}
                                    onCancel={this.handleOk}
                                    bodyStyle={{ padding: 0 }}
                                    style={{ top: 330 }}
                                    closable={false}
                                    mask={this.state.mask}
                                >
                                    <div className="change-modal">
                                        <Row>
                                            <Col span={20}>
                                                <div className="tag-title">标签</div>
                                            </Col>
                                            <Col span={4}>
                                                <Icon icon="icon-guanbi1 icon" onClick={this.handleOk} />
                                            </Col>
                                        </Row>
                                        <div className="tag-show" >
                                            <Tag color="#7ED321" className="label-circle" data-color={'#7ED321'} onClick={this.handleColor} />
                                            <Tag color="#F5D949" className="label-circle" data-color={'#F5D949'} onClick={this.handleColor} />
                                            <Tag color="#F2A240" className="label-circle" data-color={'#F2A240'} onClick={this.handleColor} />
                                            <Tag color="#D9534E" className="label-circle" data-color={'#D9534E'} onClick={this.handleColor} />
                                            <Tag color="#9941D3" className="label-circle" data-color={'#9941D3'} onClick={this.handleColor} />
                                            <Tag color="#3378B9" className="label-circle" data-color={'#3378B9'} onClick={this.handleColor} />
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </Col>
                        <Col span={7} style={{ textAlign: 'center' }} >
                            <p >开始</p>
                            {this.props.tasks[0] && this.props.tasks[0].beginTime ?
                                <div onClick={this.handleStart}>
                                    <div className="start-time" onClick={this.handleStart}>
                                        {this.props.tasks[0].beginTime}
                                    </div>
                                    <div className="try" style={{ display: this.state.showBegin ? 'block' : 'none' }} />
                                    {this.state.showBegin ?
                                        <div className="clender-setting  clender-setting-more" >
                                            <Calendar fullscreen={false} onSelect={this.onSelectChange} />
                                            <button onClick={e => this.handleChangeStart(e)}>取消</button>
                                        </div> : null}
                                </div>
                                :
                                <div className="none-time">
                                    <DatePicker
                                        placeholder=" 设置开始时间"
                                        onChange={this.onPanelChange}
                                    />
                                </div>
                            }
                        </Col>
                        <Col span={7} >
                            <p >结束</p>
                            {this.props.tasks[0] && this.props.tasks[0].endTime ?
                                <div onClick={this.handleChangeEnd}>
                                    <div className="start-time" onClick={this.handleEnd} >
                                        {this.props.tasks[0].endTime}
                                    </div>
                                    <div className="try" style={{ display: this.state.showEnd ? 'block' : 'none' }} />
                                </div>
                                :
                                <div className="none-time">
                                    <DatePicker placeholder=" 设置结束时间" onChange={this.onPanellChange} />
                                </div>}
                        </Col>
                    </Row>
                    <div className="detail-list-common detail-list-decription">
                        <p>
                            描述
                        </p>
                        {
                            this.state.shown ?
                                <ProjectInput
                                    input="添加"
                                    onClick={this.handleChangeS}
                                    value={this.state.tValue}
                                    onChange={this.handleChangeT}
                                    onConcel={this.handleClose}
                                />
                                :
                                <input
                                    type="button"
                                    value={this.props.tasks[0] && this.props.tasks[0].describe ? this.props.tasks[0].describe : '编辑'}
                                    className="input-decription"
                                    onClick={this.handleChangeS}
                                />
                        }
                    </div>
                    <div className="detail-list-common">
                        <p>清单</p>
                        {/* <ProjectTag /> */}
                        {this.props.tasklists.map((tasklist, index) => (
                            <div key={tasklist._id} >
                                <Row>
                                    <Col span={19}>
                                        <Checkbox onChange={this.handleChange} defaultChecked >{tasklist.name}</Checkbox>
                                    </Col>
                                    <Col span={2}>
                                        <span>0</span>
                                        <span>/</span>
                                        <span>{this.props.iddd[index]}</span>
                                    </Col>
                                    <Col span={3} onClick={() => this.handleRemoveList(tasklist._id)}>
                                        删除
                                    </Col>
                                </Row>
                                {this.renderTasks(tasklist.listId, index)}
                                <div style={{ marginLeft: '20px' }}>
                                    {this.state[`shownT${tasklist.listId}`] ?
                                        <ProjectInput
                                            input="添加"
                                            value={this.state.listValue}
                                            onChange={this.handldeChangetaskList}
                                            onClick={() => this.handleSendTaskList(tasklist.listId)}
                                        /> :
                                        <p>
                                            <Icon icon="icon-tianjia1" onClick={() => this.handldetaskList(tasklist.listId)} />
                                            扩充清单
                                        </p>
                                    }
                                </div>
                            </div>
                        ))
                        }
                        {this.state.shownR ?
                            <p className="ready-task">
                                <Icon icon="icon-tianjia1" onClick={this.handleChangeR} />
                                添加待办事项
                            </p> : <ProjectInput
                                input="添加"
                                value={this.state.checkValue}
                                onChange={this.handleCheck}
                                onClick={this.handleChangeCheck}
                            />
                        }
                    </div>
                    <div>
                        <div>
                            <Row>
                                <Col span={18}>
                                    <p>添加附件</p>
                                </Col>
                                <Col span={3}>
                                    <Icon icon="icon-fujian1" onClick={this.sendFile} />
                                    <input
                                        className="input-file"
                                        type="file"
                                        ref={i => this.fileInput = i}
                                        onChange={this.selectFile}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Icon icon="icon-weizhiwenjian" />
                                </Col>
                            </Row>
                        </div>
                        {this.props.files.length > 0 ?
                            <div>{
                                this.props.files.map(value => (
                                    <div style={{ display: 'flex' }} key={value._id}>
                                        <div style={{ display: 'flex', width: '180px' }} >
                                            <Icon icon="icon-wenjiangeshi-jpg" />
                                            <p style={{ marginLeft: '10px' }}>{value.type}</p>
                                        </div>
                                        <p style={{ marginRight: '10px' }}>下载</p>
                                        <p style={{ marginRight: '10px' }} onClick={() => this.handleRemoveFile(value._id)}>删除</p>
                                        <p>10月20</p>
                                    </div>))}</div> : null}

                    </div>
                    <div className="detail-list-common detail-comment">
                        <p className="comment-title">活动</p>
                        <div>
                            <div style={{ display: 'flex' }}>
                                <div className="person-size">
                                    <AvatarSelf />
                                </div>
                                <TextArea type="text" value={this.state.commentMark} onChange={this.handleChangeTT} />
                            </div>
                            <button className="comment-button" onClick={this.handleMark}>评论</button>
                        </div>
                        {this.props.activities.map((MarkValue) => {
                            console.log();
                            return (
                                <div style={{ display: 'flex' }} className="comment-talk" key={MarkValue._id} >
                                    <div className="person-size">
                                        <AvatarSelf />
                                    </div>
                                    {!this.state[`shownCreadite${MarkValue._id}`] ?
                                        <div >
                                            <p>{MarkValue.content}</p>
                                            <span>{format('yyyy-MM-dd', MarkValue.createTime)}</span>
                                            <span>--</span>
                                            <a onClick={() => this.showCreadite(MarkValue._id)}>编辑</a>
                                            <span>--</span>
                                            <span onClick={() => this.handleRemove(MarkValue._id)} >
                                                删除
                                            </span>
                                        </div>
                                        :
                                        <div>
                                            <TextArea type="text" value={this.state.changeMark} onChange={this.handleChangeMark} />
                                            <button onClick={() => this.handleCreadite(MarkValue._id)}>编辑</button>
                                        </div>}
                                </div>
                            );
                        })
                        }
                    </div>
                </div>
                {this.state.showEnd ?
                    <div className="clender-setting  clender-setting-more clender-over" >
                        <Calendar fullscreen={false} onSelect={this.onEndChange} />
                        <button onClick={e => this.handleChangeEnd(e)}>取消</button>
                    </div> : null}
            </div >

        );
    }
}
export default withTracker((Id) => {
    Meteor.subscribe('task');
    Meteor.subscribe('tasklist');
    Meteor.subscribe('active');
    Meteor.subscribe('files');
    const activities = Active.find({ taskId: Id.Id }, { sort: { createTime: -1 } }).fetch();
    const tasks = Task.find({ _id: Id.Id }).fetch();
    const tasklists = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: '' }] }).fetch();
    const taskchild = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: { $ne: '' } }] }).fetch();
    const idd = tasklists.map((id) => {
        const length = TaskList.find({ $and: [{ textId: Id.textId }, { fatherId: id.listId }] }).fetch();
        return length;
    });
    const iddd = idd.map(element => (element.length));
    //  const file = tasks[0].fileId;
    console.log(tasks, Id);
    //  const files = File.find({ _id: { $in: file } }).fetch();
    return {
        Id,
        activities,
        tasklists,
        taskchild,
        iddd,
        tasks,
        files: tasks[0] && tasks[0].fileId.length > 0 ? File.find({ _id: { $in: tasks[0].fileId } }).fetch() : '',
    };
})(ProjectItemDetail);

