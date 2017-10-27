import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';


const TabPane = Tabs.TabPane;

const tabs = [
    { title: '写日报', key: '#write', components: 'components' },
    { title: '我发出的', key: '#send', components: 'sdd' },
    { title: '我收到的', key: '#get', components: 'dds' },
];

const Welcome = ({ location, tabChange }) => (
    <Tabs defaultActiveKey={location.hash || tabs[0].key} onChange={tabChange}>
        {
            tabs.map(item => (<TabPane tab={item.title} key={item.key}>{item.components}</TabPane>))
        }
    </Tabs>
);

Welcome.propTypes = {
    tabChange: PropTypes.func,
    location: PropTypes.obkect,
};

export default Welcome;
