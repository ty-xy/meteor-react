
import React, { Component } from 'react';
import { Row, Col, Input, Button, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import Dragula from 'react-dragula';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import uuid from 'uuid';
import pureRender from 'pure-render-decorator';
// import crossvent from 'crossvent';
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
        this.containers = [];
        this.state = {
            IsShowList: false,
            cardName: '',
            cardInput: '',
            visible: false,
            concern: false,
            task: [],
            delClickFlag: true,
            uuid: '',
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

    dragulaDecorator = (componentBackingInstance) => {
        let list = [];
        if (componentBackingInstance) {
            const options = {
                isContainer(el) {
                    return el.classList.contains('container');
                },
            };
            Dragula([componentBackingInstance], options).on('drag', (el) => {
                // currentBoardId = el.getAttribute('data-index')
                list = this.props.o;
                console.log(list);
                console.log(el);
                console.log('--====drag=====');
            })
                .on('drop', (el) => {
                    console.error('--====drop=====', el.previousSibling.innerText);
                    list = this.props.o;
                    // 获得下一个对像的位置 有问题
                    const next = list.indexOf(el.previousSibling.getAttribute('data-textid'));
                    // 拖拽元素当前父元素的 taskBoardId;
                    const taskboard = el.parentNode.getAttribute('data-bid');
                    // 拖拽元素原来板的 taskBoardId
                    const prevTask = el.getAttribute('data-index');
                    // console.log('--====drop=====', this.props.fd[0][prevTask]);
                    console.log(this.props.fd[0]);
                    // 获得 原来板的 数组
                    let prev = this.props.fd[0][el.getAttribute('data-index')];
                    // 获得原来原来板 index的位置
                    const PrevIndex = prev.indexOf(el.getAttribute('data-textid'));
                    console.log(prev);
                    console.log(PrevIndex);
                    // 当前板的 数组
                    let current = this.props.fd[0][taskboard];
                    console.log(current);
                    console.log(prev);
                    // 原来板的数组删除拖拽元素
                    prev.splice(PrevIndex, 1);
                    prev = Array.from(new Set(prev));
                    console.log(prev);
                    // 现在板插入当前元素
                    current.splice(next + 1, 0, el.getAttribute('data-textid'));
                    current = Array.from(new Set(current));
                    console.log(current);
                    // 更新数据库
                    Meteor.call(
                        'changeTaskId', taskboard, current, (err) => {
                            console.log(err);
                        },
                    );
                    Meteor.call(
                        'changeTaskId', prevTask, prev, (err) => {
                            console.log(err);
                        },
                    );
                    // previousSibling = el.previousSibling;
                    // console.log('--====dragend=====', nextId, previousSibling, current, nexts);
                    // this.state.task.forEach((item) => {
                    //     console.log('item', item, currentBoardId);
                    //     if (item.taskBoardId === currentBoardId && current.indexOf(item) === -1) {
                    //         current.push(item);
                    //     }
                    //     if (item.taskBoardId === nextId && nexts.indexOf(item) === -1) {
                    //         nexts.push(item);
                    //     }
                    // });
                })
                .on('dragend', (el) => {
                    console.error('--====dragend=====', el.previousSibling.innerText);
                    // console.log('dragend', el.previousSibling.getAttribute('data-textId'));
                    // console.log(el.getAttribute('data-ind'));
                    // console.log(this.props.o.indexOf(el.previousSibling.getAttribute('data-textId')));
                    // console.log(el.previousSibling.getAttribute('data-ind'));
                    // const j = el.previousSibling.getAttribute('data-ind');
                    // console.log(this.state.task[j]);
                    // this.state.task[j + 1] = el;
                    // console.log(this.state.task[j + 1], j + 1);
                    // console.log(el.getAttribute('data-ind'));
                    // nextId = el.previousSibling.getAttribute('data-index');
                    // current = current.filter(item => (item._id !== el.getAttribute('data-id')));
                    // nexts = nexts.filter(item => (item._id !== el.getAttribute('data-id')));
                    // nexts.forEach((i, index) => {
                    //     if (i._id === previousSibling.getAttribute('data-id')) {
                    //         el.setAttribute('data-index', el.parentNode.getAttribute('data-bid'));
                    //         const CIndex = el.getAttribute('data-ind');
                    //         const currentEl = this.state.task[Math.floor(CIndex)];
                    //         console.log(currentEl, Math.floor(CIndex));
                    //         nexts.splice(index + 1, 0, currentEl);
                    //     }
                    // });
                    // list = current.concat(nexts);
                    // console.log('--====drop=====', currentBoardId, nextId, current, nexts, list);
                });
        }
    }
    renderTasks = () => this.props.taskg.map((value, index) => (
        <MiniCard
            value={value.name}
            key={`${value._id}-${index}`}
            idIndex={value._id}
            index={value.taskBoardId}
            ind={index}
            textId={value.textId}
        />
    ))
    // if (this.props.taskId === this.props.tastBoardId) {
    // this.props.o.map(value =>
    // Task.find({ uuid: value }).fetch(),
    // value,
    // return (
    //     <MiniCard
    //         value={value.name}
    //         key={`${value._id}-${index}`}
    //         idIndex={value._id}
    //         index={value.taskBoardId}
    //         ind={index}
    //     />
    // );
    // });
    // if (value.taskBoardId === this.props.tastBoardId) {
    //     console.log(index, '排位');
    //     return (
    //         <MiniCard
    //             value={value.name}
    //             key={`${value._id}-${index}`}
    //             idIndex={value._id}
    //             index={value.taskBoardId}
    //             ind={index}
    //         />
    //     );
    // }
    // return null;

    // )

    render() {
        // console.error(this.state.task);
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    {this.state.concern ?
                        <a onClick={this.handleConcern}>取消关注</a> :
                        <a onClick={this.handleConcern}>关注</a>
                    }
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <a href="http://www.taobao.com/">归档该卡片</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">删除</Menu.Item>
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
                <div >
                    <div className="container" ref={this.dragulaDecorator} key={Math.random()} data-bid={this.props.tastBoardId}>
                        {this.renderTasks()}
                    </div>
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
    const tasks = Task.find({}).fetch();
    const tasksA = TaskBoard.find({ _id: indd.tastBoardId }).fetch();
    const x = tasksA[0].sortArray;
    const taskg = Task.find({ textId: {
        $in: x } }).fetch();
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
    // const taskg = o.map((u) => {
    //     console.log(u);
    //     return Task.find({ uuid: u }).fetch()
    //     ;
    // });
    // const taskg = o.map((it)=> return  it);
    console.log(tasks, tasksA, o, taskg, fd);
    return {
        tasks,
        taskg,
        o,
        fd,
        // taskId,
    };
})(ProjectBordItem);
