import React, { Component, PureComponent } from 'react';
import { Col, Row } from 'antd';
import LeftCard from './component/LeftCard';


class Manage extends (PureComponent || Component) {
    constructor(props) {
        super(props);
        this.state = {
            companys: [
                { id: 23, name: '中亿装饰中亿装饰' },
                { id: 22, name: '博彩装亿装饰' },
            ],
        };
    }
    clickCompany = (key) => {
        console.error('e', key);
    }
    render() {
        console.error('Switch', this.props);
        return (
            <Row className="ejianlian-chat">
                <LeftCard {...this.props} {...this.state} clickCompany={this.clickCompany} />
                <Col span={18}>管理</Col>
            </Row>
        );
    }
}

export default Manage;
