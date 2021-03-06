import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Card, Row, Col } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import format from 'date-format';

import Icon from '../../../../components/Icon';
import Project from '../../../../../../imports/schema/project';
import feedback from '../../../../../util/feedback';

@pureRender
class projectOverFile extends Component {
    static propTypes = {
        projects: PropTypes.arrayOf(PropTypes.object),
        length: PropTypes.number,
    }
    constructor(...arg) {
        super(...arg);
        this.state = {
            length: '',
        };
    }
    // 做一个事件监听，监听length的长度；
    componentWillMount() {
        console.log('componentWillMount', this.props.length);
        this.setState({
            length: this.props.length,
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            length: nextProps.length,
        });
        console.log('componentWillReceiveProps', this.props.length, nextProps.length);
    }
    handleChange = (id) => {
        Meteor.call(
            'changePig', id, 1,
            (err) => {
                console.log(err);
            },
        );
    }
    handleClick =(id) => {
        feedback.dealDelete('还原', '还原后，您就可以正常操作这个项目', () => this.handleChange(id));
    }
    render() {
        return (
            <div style={{ height: '100%' }} className="ejianlian-project-back">
                <Card title="已建档项目" style={{ height: '100%', textAlign: 'center', position: 'relative' }}>
                    {this.state.length === 0 ?
                        <div className="e-p-o-right">
                            <img src="http://cdn.zg18.com/noFile.png" style={{ marginBottom: '30 px' }} />
                            <p className="e-title">你还没有已归档项目</p>
                            {/* <Icon icon="icon-meiyouxiaoshoudongtai icon" /> */}
                        </div> : <div className="over-project-back">
                            {this.props.projects.map((value) => {
                                if (value.headPortrait.indexOf('icon') === -1) {
                                    return (
                                        <Row className="list-item" key={value._id} >
                                            <Col className="list-img" span={4}>
                                                {<img src={`http://oxldjnom8.bkt.clouddn.com//${value.headPortrait}`} alt="" />}
                                            </Col>
                                            <Col className="list-right" span={3}>
                                                <p>{value.name}</p>
                                            </Col>
                                            <Col className="list-right" span={3}>{Meteor.user().profile.name}</Col >
                                            <Col className="list-right" span={8}>归档于{format('yyyy-MM-dd hh:mm:ss', value.createTime)}</Col>
                                            <Col
                                                span={3}
                                                className="button-borad back-borad"
                                                onClick={() => this.handleClick(value._id)}
                                            >还原</Col>
                                            <Col span={3} className="button-borad use-borad">使用模板</Col>
                                        </Row>
                                    );
                                }
                                return (
                                    <Row className="list-item" key={value._id} >
                                        <Col className="list-img-icon" span={4}>
                                            {<Icon icon={`${value.headPortrait} icon`} size={30}iconColor="#ddd" />}
                                        </Col>
                                        <Col className="list-right" span={3}>
                                            <p>{value.name}</p>
                                        </Col>
                                        <Col className="list-right" span={3}>{Meteor.user().profile.name}</Col>
                                        <Col span={10} className="list-right">归档于{format('yyyy-MM-dd hh:mm:ss', value.createTime)}</Col>
                                        <Col
                                            span={2}
                                            className="button-borad back-borad"
                                            onClick={() => this.handleClick(value._id)}
                                        >还原</Col>
                                        <Col span={2} className="button-borad use-borad">使用模板</Col>
                                    </Row>
                                );
                            })}
                        </div>
                    }
                </Card>
            </div>
        );
    }
}
export default withTracker(() => {
    Meteor.subscribe('project');
    console.log(Meteor.user());
    const projects = Project.find({ pigeonhole: 2 }).fetch();
    const length = projects.length;
    console.log(projects, length);
    return {
        projects,
        length,
    };
})(projectOverFile);
