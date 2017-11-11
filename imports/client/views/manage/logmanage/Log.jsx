import React, { PureComponent, Component } from 'react';
import { Tabs, Row, Modal } from 'antd';
import { Route } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Log from '../../../../../imports/schema/log';
import feedback from '../../../../util//feedback';
import Write from './Write';
import MyLog from './MyLog';
import Look from './Look';
import Detail from './Detail';


const TabPane = Tabs.TabPane;

class Logging extends (PureComponent || Component) {
    constructor(props) {
        super(props);
        this.state = {
            defaultActiveKey: '#write',
            editInfo: {},
            myLogs: [],
            logs: [],
            allUser: [],
        };
    }
    componentWillReceiveProps() {
        // const { state } = this.props.location;
        const logs = Log.find().fetch();
        const username = Meteor.user() && Meteor.user().username;
        const myLogs = Log.find({ username }).fetch();
        const allUser = Meteor.users.find().fetch();
        this.setState({ logs, myLogs, allUser });
    }
    // 日报，收到的 切换
    tabChange = (hash, e, _id) => {
        if (e) {
            e.preventDefault();
            const editInfo = (Log.find({ _id }).fetch() || []).length ? (Log.find({ _id }).fetch() || [])[0] : {};
            this.setState({ defaultActiveKey: hash, editInfo });
        } else {
            const _this = this;
            // if (this.state.defaultActiveKey === '#write') {
            //     Modal.confirm({
            //         title: '温馨提示',
            //         content: '您尚未保存，确定要离开？',
            //         okText: '确认',
            //         cancelText: '取消',
            //         onOk: () => { _this.setState({ defaultActiveKey: hash, editInfo: {} }); },
            //     });
            // } else {
            //     _this.setState({ defaultActiveKey: hash, editInfo: {} });
            // }
            _this.setState({ defaultActiveKey: hash, editInfo: {} });
        }
    }
    // 写日志
    tabSubmit = (fields) => {
        const _this = this;
        const { users } = this.props;
        fields.userId = users._id;
        fields.nickname = users.profile.name;
        fields.company = users.profile.mainCompany;
        const { editInfo } = this.state;
        if (editInfo._id) {
            fields._id = editInfo._id;
            Meteor.call(
                'updateLog',
                { ...fields },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        feedback.successToastFb('创建成功', () => { _this.setState({ defaultActiveKey: '#send', editInfo: {} }); });
                    }
                },
            );
        } else {
            Meteor.call(
                'createLog',
                { ...fields },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        feedback.successToastFb('更新成功', () => { _this.setState({ defaultActiveKey: '#send', editInfo: {} }); });
                    }
                },
            );
        }
    }
    // 删除日志
    delLog = (e, _id) => {
        e.preventDefault();
        // const _this = this;
        // 日报， 周报切换
        Modal.confirm({
            title: '提示',
            content: '您确认删除吗， 将不可撤销？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                Meteor.call(
                    'deleteLog',
                    { _id },
                    (err) => {
                        if (err) {
                            return console.error(err.reason);
                        }
                    },
                );
            },
        });
    }
    render() {
        const Content = () => (
            <Tabs className="e-mg-tab-scroll" activeKey={this.state.defaultActiveKey} onChange={this.tabChange}>
                <TabPane tab="写日报" key="#write">
                    <Write tab1Submit={this.tabSubmit} {...this.state} {...this.props} />
                </TabPane>
                <TabPane tab="我发出的" key="#send">
                    <MyLog delLog={this.delLog} {...this.state} searchMyLog={this.searchMyLog} editJump={this.tabChange} myLogs={this.state.myLogs} {...this.props} />
                </TabPane>
                <TabPane tab="我收到的" key="#get">
                    <Look searchLog={this.searchLog} {...this.state} {...this.props} />
                </TabPane>
            </Tabs>
        );
        return (
            <Row style={{ height: '100%' }}>
                <Route
                    exact
                    path="/manage/logging"
                    component={Content}
                />
                <Route path="/manage/logging/detail" component={Detail} />
            </Row>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('log');
    return {
        users: Meteor.user() || {},
        AllLogs: Log.find().fetch(),
    };
})(Logging);
