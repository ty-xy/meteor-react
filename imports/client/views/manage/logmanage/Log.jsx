import React, { PureComponent, Component } from 'react';
import { Tabs, Row } from 'antd';
import Tab1 from './Tab1';

const TabPane = Tabs.TabPane;

class Logging extends (PureComponent || Component) {
    constructor(props) {
        super(props);
        this.state = {
            defaultActiveKey: 'write',
        };
    }
    componentWillMount() {
        // console.error('props', this.props);
        // const { location } = this.props;
    }
    tabChange = (e) => {
        console.error('props', this.props);
        console.error('e', e);
        this.props.history.replace(`${this.props.location.pathname}${e}`, 'df');
    }
    tabSubmit = (e) => {
        console.error('form', e);
    }
    render() {
        const defaultActiveKey = this.props.location.hash || '#write';
        console.error(this.props, this.context);
        return (
            <Row>
                <Tabs className="e-mg-tab-scroll" defaultActiveKey={defaultActiveKey} onChange={this.tabChange}>
                    <TabPane tab="写日报" key="#write">
                        <Tab1 tab1Submit={this.tabSubmit} {...this.props} />
                    </TabPane>
                    <TabPane tab="我发出的" key="#send">
                        我发出的
                    </TabPane>
                    <TabPane tab="我收到的" key="#get">我收到的</TabPane>
                </Tabs>
            </Row>
        );
    }
}

// Logging = Form.create()(Logging);

export default Logging;
