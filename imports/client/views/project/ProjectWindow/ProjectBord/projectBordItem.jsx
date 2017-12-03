
import React, { Component } from 'react';
import { Row, Col, Input, Button, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import uuid from 'uuid';
import pureRender from 'pure-render-decorator';
import { DropTarget } from 'react-dnd';
// import { findDOMNode, ReactDOM } from 'react-dom';
// import Dragula from 'react-dragula';

import Icon from '../../../../components/Icon';
import MiniCard from './miniCard';
import ProjectInput from './projectInput';
// import ProjectItemDetail from './projectItemDetail';
import Task from '../../../../../../imports/schema/task';
import TaskBoard from '../../../../../../imports/schema/taskBoard';
import feedback from '../../../../../util/feedback';
// import Active from '../../../../../../imports/schema/active';
const { TextArea } = Input;
const ItemTypes = {
    CARD: 'card',
};
const target = {
    drop(props, monitor) {
        console.log(props.tastBoardId, Math.floor((monitor.getSourceClientOffset().y - 250) / 90));
        return { listName: props.tastBoardId, y: Math.ceil((monitor.getSourceClientOffset().y - 290) / 90) };
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver({ shallow: true }),
        highlighted: monitor.canDrop(),
    };
}

@pureRender
class ProjectBordItem extends Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        value: PropTypes.string,
        tastBoardId: PropTypes.string,
        taskg: PropTypes.arrayOf(PropTypes.object),
        tasks: PropTypes.arrayOf(PropTypes.object),
        tasksA: PropTypes.array,
        x: PropTypes.array,
        projectId: PropTypes.string,
        // changeTitle: PropTypes.func,
        fd: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...props) {
        super(...props);
        this.Containers = [];
        this.state = {
            IsShowList: false,
            cardName: '',
            cardInput: '',
            visible: false,
            concern: false,
            task: [],
            uuid: '',
            showTaskBoardTitle: true,
            titleValue: '',
            array: '',
            taskList: '',
            tasksA: '',
        };
    }
    componentWillMount() {
        this.setState({
            titleValue: this.props.value,
            array: this.props.x,
            taskList: this.props.taskg,
            tasksA: this.props.tasksA,
        });
        console.log(this.state);
    }
    componentDidMount() {
        console.log(this.state);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            titleValue: this.props.value,
            array: this.props.x,
            taskList: nextProps.taskg,
            tasksA: this.props.tasksA,
            fd: nextProps.fd,
        });
    }
    handleConcern = () => {
        this.setState({
            concern: !this.state.concern,
        });
    }
    showModal = (e) => {
        this.setState({
            visible: true,
        });
        console.log(e.target._id);
        // console.log(this.i.key, 1111111);
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    handleDelete = () => {
        const exsist = this.props.fd[0][this.props.tastBoardId];
        if (exsist.length === 0) {
            Meteor.call(
                'deleteaTaskBoard', this.props.tastBoardId, (err) => {
                    console.log(err);
                },
            );
        } else {
            feedback.dealWarning('你还有未清空的任务卡');
        }
    }
    handleClick = () => {
        this.createTask();
        this.setState({
            IsShowList: !this.state.IsShowList,
            cardInput: '',
            task: this.props.tasks,
        });
    }
    handleChange = (e) => {
        this.setState({
            cardInput: e.target.value,
        });
    }
    handleList = () => {
        this.setState({
            IsShowList: !this.state.IsShowList,
            cardInput: '',
            uuids: uuid.v4(),
        });
    }
    // 更改任务版的标题
    handlechangeTitle =() => {
        this.setState({
            showTaskBoardTitle: !this.state.showTaskBoardTitle,
        });
    }
    handleChangeBTitle =(e) => {
        this.setState({
            titleValue: e.target.value,
        });
    }
    handleChangeTitleB =() => {
        Meteor.call(
            'changeTaskBoard', this.props.tastBoardId, this.state.titleValue, (err) => {
                console.log(err);
            },
        );
        this.setState({
            titleValue: '',
            showTaskBoardTitle: !this.state.showTaskBoardTitle,
        });
    }
    createTask = () => {
        //  console.log(this.state.projectId);
        Meteor.call(
            'createTask',
            {
                name: this.state.cardInput,
                taskBoardId: this.props.tastBoardId,
                textId: this.state.uuids,
                memberId: Meteor.userId(),
            },
            (err) => {
                console.log(err);
            },
        );
        Meteor.call(
            'changeSortAarry',
            this.props.tastBoardId,
            this.state.uuids,
            (err) => {
                console.log(err);
            },
        );
    }
    // 删除卡片x
    handleDeleteTaskL = (item) => {
        feedback.dealDelete('提示', '确定要删除该卡片吗?', () => this.handleDeleteTask(item));
    }
    handleDeleteTask = (itemd) => {
        const deleteCard = this.props.fd[0][this.props.tastBoardId];
        const deleteIndex = deleteCard.indexOf(itemd);
        deleteCard.splice(deleteIndex, 1);
        Meteor.call(
            'deleteaTaskBoardTask', this.props.tastBoardId, deleteCard, itemd, (err) => {
                console.log(err);
            },
        );
    }

    handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.handleClick();
        }
    }
    renderTasks = () => this.props.x.map((item, index) => this.props.taskg.map((value) => {
        if (value.textId === item) {
            return (<MiniCard
                value={value.name}
                key={value.textId}
                idIndex={value._id}
                index={value.taskBoardId}
                ind={index}
                textId={value.textId}
                projectId={this.props.projectId}
                deleteCard={() => this.handleDeleteTaskL(value.textId)}
            />);
        }
        return null;
    }))
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <p onClick={this.handlechangeTitle}>编辑名称</p>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <a onClick={this.handleDelete} >删除</a>
                </Menu.Item>
            </Menu>
        );
        const {
            connectDropTarget,
        } = this.props;
        return connectDropTarget(
            <div className="ejianlian-project-item-list">
                <div className="list-title">
                    <Row>
                        <Col span={21} style={{ display: 'flex' }}>
                            {this.state.showTaskBoardTitle ?
                                <p onClick={this.handlechangeTitle}>{this.props.value}</p> :
                                <ProjectInput
                                    input="更改"
                                    onClick={this.handleChangeTitleB}
                                    value={this.state.titleValue}
                                    onChange={this.handleChangeBTitle}
                                    onConcel={this.handlechangeTitle}
                                />}
                            {this.state.concern ?
                                <Icon icon="icon-guanzhu icon icon-eye" /> : null}
                        </Col>
                        <Col span={3} style={{ textAlign: 'center' }}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon icon="icon-gengduo1 icon" />
                            </Dropdown>
                        </Col>
                    </Row>
                </div>
                {this.state.tasksA.length > 0 && this.state.tasksA[0].sortArray ?
                    this.renderTasks() : null}
                {this.state.IsShowList ?
                    <div className="list-input">
                        <TextArea
                            type="text"
                            className="Input-text"
                            placeholder="请输入卡片内容"
                            autoFocus
                            autosize={{ minRows: 1, maxRows: 6 }}
                            value={this.state.cardInput}
                            onChange={this.handleChange}
                            onKeyDown={this.handleSendMessage}
                        />
                        <div className="list-button">
                            <Button onClick={this.handleClick}>确认</Button>
                            <button onClick={this.handleList}>取消</button>
                        </div>
                    </div> :
                    <div className="list-add list-title" onClick={this.handleList}>
                        <Icon icon="icon-jiahao icon" iconColor="#999" size={14} />
                        <p>添加卡片</p>
                    </div>
                }
            </div >,
        );
    }
}
export default DropTarget(ItemTypes.CARD, target, collect)(withTracker((indd) => {
    Meteor.subscribe('task');
    Meteor.subscribe('taskboard');
    Meteor.subscribe('company');
    const tasks = Task.find({}).fetch();
    const tasksA = TaskBoard.find({ _id: indd.tastBoardId }).fetch();
    if (tasksA.length !== 0) {
        const x = tasksA[0].sortArray;
        const taskg = Task.find({
            textId: {
                $in: x,
            },
        }).fetch();
        const hash = {};
        const fd = TaskBoard.find({}).fetch().map((value) => {
            const ide = value._id;
            const dde = value.sortArray;
            hash[ide] = dde;
            return hash;
        });
        return {
            tasks,
            taskg,
            x,
            fd,
            tasksA,
        };
    }
    return {
        tasksA,
    };
})(ProjectBordItem));
