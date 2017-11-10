import React, { Component } from 'react';
import { Modal } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
// import format from 'date-format';

import ProjectItemDetail from './projectItemDetail';
import Task from '../../../../../../imports/schema/task';
import Active from '../../../../../../imports/schema/active';
import Icon from '../../../../components/Icon';

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
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps);
        // setTimeout(() => {
        //     this.setState({
        //         delClickFlag: true,
        //     });
        // }, 1);
        // console.log(this.state.delClickFlag);
    }
    showModal = (e) => {
        this.setState({
            visible: true,
            left: e.target.offsetLeft,
        });
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        console.log(this.state.left);
        console.log(this.props.idIndex);
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
                    <div style={{ display: 'flex' }}>
                        {this.props.begintime ?

                            <div className="time-show">
                                <Icon icon="icon-qingjiaicon" />
                                <p className="time-number">{this.props.begintime}</p>
                            </div> : null
                        }
                        {this.props.endtime ?
                            <div className="time-show">
                                <Icon icon="icon-qingjiaicon" />
                                <p className="time-number">{this.props.endtime}</p>
                            </div> : null
                        }
                    </div>
                    {this.props.activeL ?
                        <div className="talk-show">
                            <Icon icon="icon-xiaoxi1" />
                            <p className="talk-number">{this.props.activeL} </p>
                        </div> : null
                    }
                    <Modal
                        visible={this.state.visible}
                        footer={null}
                        onCancel={this.hideModal}
                        onOk={this.hideModal}
                        width={315}
                        style={{ top: 220, left: this.state.left + 37, boxShadow: 'none' }}
                        mask={this.state.mask}
                        className="Moal-reset"
                        bodyStyle={{ padding: 0 }}
                    >
                        <ProjectItemDetail item={this.props.value} Id={this.props.idIndex} />
                    </Modal>
                </div>
            </div >);
    }
}

export default withTracker((taskid) => {
    Meteor.subscribe('active');
    Meteor.subscribe('task');
    const tasks = Task.find({ _id: taskid.idIndex }).fetch();
    const activeL = Active.find({ taskId: taskid.idIndex }).fetch().length;
    const begintime = tasks[0].beginTime;
    const endtime = tasks[0].endTime;
    const label = tasks[0].label;
    return {
        begintime,
        activeL,
        endtime,
        label,
    };
})(MiniCard);
