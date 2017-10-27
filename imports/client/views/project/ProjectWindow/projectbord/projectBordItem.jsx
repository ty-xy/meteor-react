
import React, { Component } from 'react';
import { Row, Col, Input, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
import Icon from '../../../../components/Icon';
import ProjectItemDetail from './projectItemDetail';
import Task from '../../../../../../imports/schema/task';

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
            tastBoardId: this.props.tastBoardId,
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        console.log(1);
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
                    <div className="list-message" key={value._id}>
                        <div className="list-message-item" onClick={this.showModal} >
                            {value.name}
                            <Modal
                                visible={this.state.visible}
                                footer={null}
                                onCancel={this.hideModal}
                                onOk={this.hideModal}
                                width={450}
                            >
                                <ProjectItemDetail />
                            </Modal>
                        </div>
                    </div>);
            }
            return null;
        });
    }
    //  }
    render() {
        console.log('fgh', this.state, this.props.tasks);
        return (
            <div className="ejianlian-project-item-list">
                <div className="list-title">
                    <Row>
                        <Col span={19}>
                            <p>{this.props.value}</p>
                        </Col>
                        <Col span={3} style={{ textAlign: 'center' }}>
                            <Icon icon="icon-jiahao icon" />
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            <Icon icon="icon-gengduo1 icon" />
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
    Meteor.subscribe('task');
    const tasks = Task.find({}).fetch();
    return {
        tasks,
        // taskId,
    };
})(ProjectBordItem);
