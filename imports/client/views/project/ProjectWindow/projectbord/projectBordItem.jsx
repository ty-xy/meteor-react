
import React, { Component } from 'react';
import { Row, Col, Input, Button, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import uuid from 'uuid';
import pureRender from 'pure-render-decorator';
import Dragula from 'react-dragula';
import Icon from '../../../../components/Icon';
import MiniCard from './miniCard';
// import ProjectItemDetail from './projectItemDetail';
import Task from '../../../../../../imports/schema/task';
import TaskBoard from '../../../../../../imports/schema/taskBoard';
// import Active from '../../../../../../imports/schema/active';
const { TextArea } = Input;
@pureRender
class ProjectBordItem extends Component {
    static propTypes = {
        value: PropTypes.string,
        tastBoardId: PropTypes.string,
        taskg: PropTypes.arrayOf(PropTypes.object),
        tasks: PropTypes.arrayOf(PropTypes.object),
        o: PropTypes.string,
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
            delClickFlag: true,
            uuid: '',
            error: null,
            // nextId: '',
        };
    }
    componentWillMount() {
        // const tasks = Task.find({}).fetch();
        // console.log('nextProps', tasks);
    }

    componentWillReceiveProps(nextProps) {
        const tasks = Task.find({}).fetch();
        console.log('nextProps', nextProps);
        this.setState({
            task: tasks,
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
        Meteor.call(
            'deleteaTaskBoardTask', this.props.tastBoardId, (err) => {
                console.log(err);
            },
        );
        Meteor.call(
            'deleteaTaskBoard', this.props.tastBoardId, (err) => {
                console.log(err);
            },
        );
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
        // console.log(this.state.cardInput);
        // console.log(this.props.tastId);
    }
    handleList = () => {
        this.setState({
            IsShowList: !this.state.IsShowList,
            uuids: uuid.v4(),
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
    // 重排序到顶部
    handleRepeat =(repeat, taskBoardId) => {
        const topArray = this.props.fd[0][taskBoardId];
        const IndexTop = topArray.indexOf(repeat);
        topArray.unshift(repeat);
        topArray.splice(IndexTop + 1, 1);
        console.log(topArray, repeat, taskBoardId, IndexTop);
        Meteor.call(
            'changeTaskId', taskBoardId, topArray,
            (err) => {
                console.log(err);
            },
        );
    }
    // 重排序到底部
    handleReorder=(repeat, taskBoardId) => {
        const topArray = this.props.fd[0][taskBoardId];
        const IndexTop = topArray.indexOf(repeat);
        topArray.push(repeat);
        topArray.splice(IndexTop, 1);
        console.log(topArray, repeat, taskBoardId, IndexTop);
        Meteor.call(
            'changeTaskId', taskBoardId, topArray,
            (err) => {
                console.log(err);
            },
        );
    }
    dragulaDecorator = (componentBackingInstance) => {
        let list = [];
        let prev = [];
        let next = '';
        let nextId = '';
        let oldId = '';
        let oldIndex = '';
        let current = [];
        let newList = [];
        if (componentBackingInstance) {
            const options = {
                isContainer(el) {
                    return el.classList.contains('container');
                },
                // direction: 'horizontal',
            };
            console.log(componentBackingInstance);
            Dragula([componentBackingInstance], options).on('drag', (el, source) => {
                console.log(el, source);
            })
                .on('drop', (el, target, source, sibling) => {
                    console.error('--====drop=====', el, el.parentNode, sibling, target, source);
                    list = this.props.fd;
                    if (target === source) {
                        newList = list[0][target.getAttribute('data-bid')];
                        oldId = el.getAttribute('data-textId');
                        oldIndex = newList.indexOf(oldId);
                        if (sibling !== null) {
                            next = sibling.getAttribute('data-textId');
                            nextId = newList.indexOf(next);
                            console.log(oldIndex);
                            if (nextId < oldIndex) {
                                newList.splice(oldIndex, 1);
                                newList.splice(nextId, 0, el.getAttribute('data-textId'));
                                Meteor.call(
                                    'changeTaskId', target.getAttribute('data-bid'), newList,
                                    (err) => {
                                        console.log(err);
                                    },
                                );
                            } else if (nextId > oldIndex) {
                                newList.splice(oldIndex, 1);
                                newList.splice(nextId - 1, 0, el.getAttribute('data-textId'));
                                Meteor.call(
                                    'changeTaskId', target.getAttribute('data-bid'), newList,
                                    (err) => {
                                        console.log(err);
                                    },
                                );
                            }
                        } else {
                            newList.splice(oldIndex, 1);
                            newList.push(oldId);
                            Meteor.call(
                                'changeTaskId', target.getAttribute('data-bid'), newList,
                                (err) => {
                                    console.log(err);
                                },
                            );
                        }
                    } else if (target !== source) {
                        // console.log(sibling.parentNode);
                        if (el.parentNode === target && sibling !== null) {
                            current = list[0][target.getAttribute('data-bid')];
                            next = sibling.getAttribute('data-textId');

                            // 获得它INDEX 值
                            nextId = current.indexOf(next);
                            current.splice(nextId, 0, el.getAttribute('data-textId'));

                            current = Array.from(new Set(current));
                            console.log(current);
                            Meteor.call(
                                'changeTaskId', target.getAttribute('data-bid'), current,
                                (err) => {
                                    console.log(err);
                                },
                            );
                        } else if (sibling === null && el.parentNode === target) {
                            current = list[0][target.getAttribute('data-bid')];
                            current.push(el.getAttribute('data-textId'));
                        }
                        if (sibling !== null && sibling.parentNode === source && sibling.parentNode !== target) {
                            prev = list[0][source.getAttribute('data-bid')];
                            oldId = el.getAttribute('data-textId');
                            oldIndex = prev.indexOf(oldId);
                            prev.splice(oldIndex, 1);
                            console.log(prev, sibling.parentNode, source);
                            Meteor.call('changeTaskId', source.getAttribute('data-bid'), prev, (err) => {
                                console.log(err);
                            },
                            );
                        }
                        // alert(current, prev, nextId, next);
                    }
                });
        }
    }
    renderTasks = () => this.props.o.map((item, index) => this.props.taskg.map((value) => {
        if (value.textId === item) {
            console.log(item);
            return (<MiniCard
                value={value.name}
                key={value._id}
                idIndex={value._id}
                index={value.taskBoardId}
                ind={index}
                textId={value.textId}
                click={() => this.handleRepeat(value.textId, value.taskBoardId)}
                clickB={() => this.handleReorder(value.textId, value.taskBoardId)}
            />);
        }
        return <div />;
    }))
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    {this.state.concern ?
                        <a onClick={this.handleConcern}>取消关注</a> :
                        <a onClick={this.handleConcern}>关注</a>
                    }
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <a onClick={this.handleDelete} >删除</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="ejianlian-project-item-list">
                <div className="list-title">
                    <Row>
                        <Col span={19} style={{ display: 'flex' }}>
                            <p>{this.props.value}</p>
                            {this.state.concern ?
                                <Icon icon="icon-guanzhu icon icon-eye" /> : null}
                        </Col>
                        <Col span={3} style={{ textAlign: 'center' }}>
                            <Icon icon="icon-jiahao icon" />
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon icon="icon-gengduo1 icon" />
                            </Dropdown>
                        </Col>
                    </Row>
                </div>

                <div className="container" ref={this.dragulaDecorator} key="7" data-bid={this.props.tastBoardId}>
                    {this.renderTasks()}
                </div>

                {this.state.IsShowList ?
                    <div className="list-input">
                        <TextArea
                            type="text"
                            className="Input-text"
                            placeholder="请输入卡片内容"
                            autosize
                            value={this.state.cardInput}
                            onChange={this.handleChange}
                        />
                        <div className="list-button">
                            <Button onClick={this.handleClick}>确认</Button>
                            <button onClick={this.handleList}>取消</button>
                        </div>
                    </div> :
                    <div className="list-add list-title" >
                        <Icon icon="icon-jiahao icon" onClick={this.handleList} />
                        <p>添加卡片</p>
                    </div>
                }
            </div >
        );
    }
}
export default withTracker((indd) => {
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
            console.log(value._id);
            const ide = value._id;
            const dde = value.sortArray;
            hash[ide] = dde;
            return hash;
        });
        const o = Array.from(new Set(x));
        console.log(o);
        console.log(tasks, tasksA, o, taskg, fd);
        return {
            tasks,
            taskg,
            o,
            fd,
            // taskId,
        };
    }
})(ProjectBordItem);
