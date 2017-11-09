import React, { Component } from 'react';
import { Row, Col, Input, Calendar, Menu, Dropdown, Checkbox, Modal, Tooltip, Tag } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
// import format from 'date-format';
import format from 'date-format';
import pureRender from 'pure-render-decorator';
import AvatarSelf from '../../../../components/AvatarSelf';
import Icon from '../../../../components/Icon';
import ProjectInput from './projectInput';
import Task from '../../../../../../imports/schema/task';
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
        decription: PropTypes.string, // 描述的值
        activities: PropTypes.arrayOf(PropTypes.object),
        begintime: PropTypes.string,
        endtime: PropTypes.string,
        tasklists: PropTypes.arrayOf(PropTypes.object),
        taskchild: PropTypes.arrayOf(PropTypes.object),
        label: PropTypes.string,
        iddd: PropTypes.array,
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

        };
    }
    componentDidMount() {
        console.log('componentWillMount', this.props.tasklists);
    }
    onPanellChange = (value) => {
        console.log(111);
        this.setState({
            time: value.format('L'),
        });
        Meteor.call(
            'changeTime', this.props.Id.Id, this.state.time,
            (err) => {
                console.log(err);
            },
        );
    }
    onPanelChange = (value) => {
        console.log(111);
        this.setState({
            endtime: value.format('L'),
        });
        Meteor.call(
            'changeEndTime', this.props.Id.Id, this.state.endtime,
            (err) => {
                console.log(err);
            },
        );
    }
    // 处理日历
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showOk = () => {
        this.setState({
            visiblel: true,
        });
    }
    showOver = () => {
        this.setState({
            visib: true,
        });
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    hideOver = () => {
        this.setState({
            visib: false,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visiblel: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visiblel: false,
        });
    }
    // 创建任务表单
    handleChangeS = () => {
        this.createTask();
        this.setState({
            shown: !this.state.shown,
        });
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
                fatherId: '',
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
                fatherId: id,
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
        console.log(this.state.time, 1111);
        // const { startValue, endValue, endOpen } = this.state;
        const menu = (
            <Menu >
                <Menu.Item key="0">
                    卡片操作
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <a href="http://www.taobao.com/">关注</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">编辑成员</Menu.Item>
                <Menu.Item key="3">编辑标签</Menu.Item>
                <Menu.Item key="4">编辑附件</Menu.Item>
                <Menu.Item key="5" >
                    <a onClick={this.showModal}>修改起始日期</a>
                </Menu.Item>
                <Menu.Item key="6">修改截止日期</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="7">移到顶部</Menu.Item>
                <Menu.Item key="8">移到底部</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="9">移到卡片</Menu.Item>
                <Menu.Item key="10">复制卡片</Menu.Item>
                <Menu.Item key="11">归档卡片</Menu.Item>
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
                    <Modal
                        visible={this.state.visible}
                        z-index={1050}
                        className="Modal-mask"
                        mask={this.state.mask}
                        onCancel={this.hideModal}
                        onOk={this.hideModal}
                        width={200}
                    >
                        <Calendar fullscreen={false} onChange={this.onPanellChange} />
                    </Modal>
                    <Modal
                        visible={this.state.visib}
                        z-index={1050}
                        className="Modal-mask"
                        mask={this.state.mask}
                        onCancel={this.hideOver}
                        onOk={this.hideOver}
                        width={200}
                    >
                        <Calendar fullscreen={false} onChange={this.onPanelChange} />
                    </Modal>
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
                                    <p className="circle-icon-l" onClick={this.showOk} style={{ background: this.props.label || '#7ED321' }} />
                                </Tooltip>
                                <Modal
                                    visible={this.state.visiblel}
                                    onOk={this.handleOk}
                                    width={156}
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
                        <Col span={7} style={{ textAlign: 'center' }} onClick={this.showModal}>
                            <p >开始</p>
                            {this.props.begintime ?
                                <div className="start-time">
                                    {this.props.begintime}
                                </div>
                                :
                                <div className="none-time">设置开始时间</div>
                            }
                        </Col>
                        <Col span={7} onClick={this.showOver}>
                            <p >结束</p>
                            {this.props.endtime ?
                                <div className="start-time" >
                                    {this.props.endtime}
                                </div>
                                :
                                <div className="none-time">设置结束时间</div>}

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
                                    value={this.props.decription || '编辑'}
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
                                        <Checkbox onChange={this.handleChange} defaultChecked disabled>{tasklist.name}</Checkbox>
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
                                {this.renderTasks(tasklist._id, index)}
                                <div style={{ marginLeft: '20px' }}>
                                    {this.state[`shownT${tasklist._id}`] ?
                                        <ProjectInput
                                            input="添加"
                                            value={this.state.listValue}
                                            onChange={this.handldeChangetaskList}
                                            onClick={() => this.handleSendTaskList(tasklist._id)}
                                        /> :
                                        <p>
                                            <Icon icon="icon-tianjia1" onClick={() => this.handldetaskList(tasklist._id)} />
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
                        <p>附件</p>
                        <div style={{ display: 'flex' }}>
                            <p className="add-fujian">插畫</p>
                            <p className="add-fujian">添加附件</p>
                        </div>
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
            </div >

        );
    }
}
export default withTracker((Id) => {
    Meteor.subscribe('task');
    Meteor.subscribe('tasklist');
    Meteor.subscribe('active');
    const activities = Active.find({ taskId: Id.Id }, { sort: { createTime: -1 } }).fetch();
    const tasks = Task.find({ _id: Id.Id }).fetch();
    const tasklists = TaskList.find({ $and: [{ taskId: Id.Id }, { fatherId: '' }] }).fetch();
    const taskchild = TaskList.find({ $and: [{ taskId: Id.Id }, { fatherId: { $ne: '' } }] }).fetch();
    const idd = tasklists.map((id) => {
        // const list = {};
        const length = TaskList.find({ $and: [{ taskId: Id.Id }, { fatherId: id._id }] }).fetch();
        // list.fatherId = length;
        // console.log(list);
        return length;
    });
    const iddd = idd.map(element => (element.length));
    // const id = activities.map(i => i._id);
    const decription = tasks[0].describe;
    const begintime = tasks[0].beginTime;
    const endtime = tasks[0].endTime;
    const label = tasks[0].label;
    console.log(idd, iddd);
    return {
        Id,
        decription,
        activities,
        begintime,
        tasklists,
        taskchild,
        endtime,
        label,
        iddd,
    };
})(ProjectItemDetail);

