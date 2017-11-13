import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Card } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
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
            <div style={{ height: '690px' }} className="ejianlian-project-back">
                <Card title="已建档项目" style={{ height: '100%', textAlign: 'center', position: 'relative' }}>
                    {this.state.length === 0 ?
                        <div className="e-p-o-right">
                            <p>你还没有已归档项目</p>
                            <Icon icon="icon-meiyouxiaoshoudongtai icon" />
                        </div> : <div className="over-project-back">
                            {this.props.projects.map((value) => {
                                if (value.headPortrait.indexOf('icon') === -1) {
                                    return (
                                        <li className="list-item" key={value._id} >
                                            <div className="list-img">
                                                {<img src={`http://oxldjnom8.bkt.clouddn.com//${value.headPortrait}`} alt="" />}
                                            </div>
                                            <div className="list-right">
                                                <p>{value.name}</p>
                                            </div>
                                            <div className="list-right">周小妹</div>
                                            <div className="list-right">归档于 2017-05-30 17:03</div>
                                            <div className="button-borad back-borad" style={{ marginLeft: '400px' }} onClick={() => this.handleClick(value._id)}>还原</div>
                                            <div className="button-borad use-borad">使用模板</div>
                                        </li>
                                    );
                                }
                                return (
                                    <li className="list-item" key={value._id} style={{ display: 'flex' }}>
                                        <div className="list-img-icon">
                                            {<Icon icon={`${value.headPortrait} icon`} size="30px" iconColor="#ddd" />}
                                        </div>
                                        <div className="list-right">
                                            <p>{value.name}</p>
                                        </div>
                                        <div className="list-right">周小妹</div>
                                        <div className="list-right">归档于 2017-05-30 17:03</div>
                                        <div className="button-borad back-borad" style={{ marginLeft: '400px' }} onClick={() => this.handleClick(value._id)}>还原</div>
                                        <div className="button-borad use-borad">使用模板</div>
                                    </li>
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
    const projects = Project.find({ pigeonhole: 2 }).fetch();
    const length = projects.length;
    console.log(projects, length);
    return {
        projects,
        length,
    };
})(projectOverFile);
