import React, { PureComponent, Component } from 'react';
import { Tabs, Row } from 'antd';
import Write from './Write';
import Self from './Self';

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
    // 日报，收到的 切换
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
            <Row style={{ height: '100%' }}>
                <Tabs className="e-mg-tab-scroll" defaultActiveKey={defaultActiveKey} onChange={this.tabChange}>
                    <TabPane tab="写日报" key="#write">
                        <Write tab1Submit={this.tabSubmit} {...this.props} />
                    </TabPane>
                    <TabPane tab="我发出的" key="#send">
                        <Self tab1Submit={this.tabSubmit} {...this.props} />
                    </TabPane>
                    <TabPane tab="我收到的" key="#get">我收到的</TabPane>
                </Tabs>
            </Row>
        );
    }
}

// Logging = Form.create()(Logging);

export default Logging;
