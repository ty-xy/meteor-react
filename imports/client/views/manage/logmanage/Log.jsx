import React, { PureComponent, Component } from 'react';
import { Tabs, Row, Modal } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Log from '../../../../../imports/schema/log';
import Write from './Write';
import MyLog from './MyLog';
import Look from './Look';


const TabPane = Tabs.TabPane;

class Logging extends (PureComponent || Component) {
    constructor(props) {
        super(props);
        this.state = {
            defaultActiveKey: '#write',
        };
    }
    componentWillReceiveProps() {
        // const { location } = this.props;
        const editInfo = Log.findOne({ username: Meteor.user() && Meteor.user().username });
        this.setState({ editInfo });
    }
    // 日报，收到的 切换
    tabChange = (hash, e) => {
        if (e) {
            e.preventDefault();
            this.setState({ defaultActiveKey: hash });
        }
        this.setState({ defaultActiveKey: hash });
    }
    // 写日志
    tabSubmit = (fields) => {
        const { users } = this.props;
        fields.username = users.username;
        Meteor.call(
            'createLog',
            { ...fields },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                console.error('form', fields);
            },
        );
        console.error('form', fields);
    }
    // 删除日志
    delLog = (e, id) => {
        e.preventDefault();
        // const _this = this;
        // 日报， 周报切换
        Modal.confirm({
            title: '提示',
            content: '您确认删除吗， 将不可撤销？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                console.log('delLog', e, id);
            },
        });
    }
    // 搜索我的日志
    searchMyLog = (data) => {
        console.log('searchMyLog', data);
    }
    // 搜索所有日志
    searchLog = (data) => {
        console.log('searchLog', data);
    }
    render() {
        // console.error('this.props', this.props, this.state);
        return (
            <Row style={{ height: '100%' }}>
                <Tabs className="e-mg-tab-scroll" activeKey={this.state.defaultActiveKey} onChange={this.tabChange}>
                    <TabPane tab="写日报" key="#write">
                        <Write tab1Submit={this.tabSubmit} {...this.props} />
                    </TabPane>
                    <TabPane tab="我发出的" key="#send">
                        <MyLog delLog={this.delLog} searchMyLog={this.searchMyLog} editJump={this.tabChange} {...this.props} />
                    </TabPane>
                    <TabPane tab="我收到的" key="#get">
                        <Look searchLog={this.searchLog} {...this.props} />
                    </TabPane>
                </Tabs>
            </Row>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('log');
    return {
        users: Meteor.user() || {},
        logs: Log.find().fetch(),
    };
})(Logging);
