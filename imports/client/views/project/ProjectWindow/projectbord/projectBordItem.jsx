
import React, { Component } from 'react';
import { Row, Col, Input, Button, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import Dragula from 'react-dragula';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
// import crossvent from 'crossvent';
import Icon from '../../../../components/Icon';
import MiniCard from './miniCard';
// import ProjectItemDetail from './projectItemDetail';
import Task from '../../../../../../imports/schema/task';
// import Active from '../../../../../../imports/schema/active';
const { TextArea } = Input;
@pureRender
class ProjectBordItem extends Component {
    static propTypes = {
        value: PropTypes.string,
        tastBoardId: PropTypes.string,
        tasks: PropTypes.arrayOf(PropTypes.object),
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
        };
    }
    componentWillMount() {
        // const tasks = Task.find({}).fetch();
        // console.log('nextProps', tasks);
    }
    componentWillReceiveProps() {
        const tasks = Task.find({}).fetch();
        // console.log('nextProps', tasks);
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
        });
    }
    createTask = () => {
        //  console.log(this.state.projectId);
        Meteor.call(
            'createTask',
            {
                name: this.state.cardInput,
                taskBoardId: this.props.tastBoardId,
            },
            (err) => {
                console.log(err);
            },
        );
    }

    dragulaDecorator = (componentBackingInstance) => {
        // let nexts = [];
        // let current = [];
        // let list = [];
        // let currentBoardId = '';
        // let nextId = '';
        // let previousSibling = '';
        if (componentBackingInstance) {
            const options = {
                isContainer(el) {
                    return el.classList.contains('container');
                },
            };
            Dragula([componentBackingInstance], options).on('drag', (el) => {
                // currentBoardId = el.getAttribute('data-index');
                console.log(el);
                // console.log('--====drag=====', currentBoardId);
            })
                .on('drop', (el) => {
                    console.log('--====drop=====', el.previousSibling);
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
                    console.log('--====dragend=====', el.previousSibling);
                // console.log('dragend', el.previousSibling.getAttribute('data-id'));
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
    renderTasks = () =>
        // if (this.props.taskId === this.props.tastBoardId) {
        this.state.task.map((value, index) => {
            if (value.taskBoardId === this.props.tastBoardId) {
                console.log(index, '排位');
                return (
                    <MiniCard
                        value={value.name}
                        key={`${value._id}-${index}`}
                        idIndex={value._id}
                        index={value.taskBoardId}
                        ind={index}
                    />
                );
            }
            return null;
        })

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
                        {this.renderTasks() }
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
export default withTracker(() => {
    Meteor.subscribe('task');
    const tasks = Task.find({}).fetch();
    console.log(tasks);
    return {
        tasks,
        // taskId,
    };
})(ProjectBordItem);
