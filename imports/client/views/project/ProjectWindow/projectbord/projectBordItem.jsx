
import React, { Component } from 'react';
import { Row, Col, Input, Button, Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
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
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowList: false,
            cardName: '',
            cardInput: '',
            visible: false,
            concern: false,
        };
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
        console.log(this.i.key);
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
        });
    }
    handleChange = (e) => {
        this.setState({
            cardInput: e.target.value,
        });
        console.log(this.state.cardInput);
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
    renderTasks() {
        // if (this.props.taskId === this.props.tastBoardId) {
        return this.props.tasks.map((value) => {
            console.log(11);
            if (value.taskBoardId === this.props.tastBoardId) {
                return (
                    <MiniCard value={value.name} key={value._id} idIndex={value._id} />
                );
            }
            return null;
        });
    }
    //  }
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
                {
                    this.renderTasks()
                }

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
    //  Meteor.subscribe('active');
    Meteor.subscribe('task');
    const tasks = Task.find({}).fetch();
    console.log(tasks);
    return {
        tasks,
        // taskId,
    };
})(ProjectBordItem);
