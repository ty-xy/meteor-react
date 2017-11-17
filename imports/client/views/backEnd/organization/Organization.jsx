import React, { Component } from 'react';
import { Col, Row } from 'antd';

class Organization extends Component {
    render() {
        return (
            <div className="e-mg-organization">
                <Row>
                    <Col span={6}>组织结构</Col>
                    <Col span={18}>组织结构</Col>
                </Row>
            </div>
        );
    }
}

export default Organization;
