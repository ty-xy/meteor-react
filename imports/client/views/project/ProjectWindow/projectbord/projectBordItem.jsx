
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import pureRender from 'pure-render-decorator';
import Icon from '../../../../components/Icon';

@pureRender
class ProjectBordItem extends Component {
    render() {
        return (
            <div className="ejianlian-project-item-list">
                <div className="list-title">
                    <Row>
                        <Col span={19}>
                            <p>项目评估</p>
                        </Col>
                        <Col span={3} style={{ textAlign: 'center' }}>
                            <Icon icon="icon-jiahao icon" />
                        </Col>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            <Icon icon="icon-gengduo1 icon" />
                        </Col>
                    </Row>
                </div>
                <div className="list-add list-title" >
                    <Icon icon="icon-jiahao icon" />
                    <p>添加卡片</p>
                </div>
            </div >
        );
    }
}

export default ProjectBordItem;
