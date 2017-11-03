import React from 'react';
import { Col, Button } from 'antd';
import {
    Link,
} from 'react-router-dom';
import MyIcon from '../../../components/Icon';


export default props => (
    props.btns.map(item => (
        <Col span={8} key={item.key} className="e-mg-left-per">
            <Button className={`e-mg-left-btn ${(props.history.location.pathname.indexOf(item.url) > -1) ? 'e-mg-left-btn-primary' : ''}`}>
                <Link to={item.url}>
                    <MyIcon icon={item.icon} size={32} iconColor={item.selected} />
                </Link>
            </Button>
            <p>{item.name}</p>
        </Col>
    ))
);
