import React, { Component, PureComponent } from 'react';
import { Button, Col, Card, Dropdown, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';

// 按钮组
const btns = [
    { key: 'checking', name: '考勤', icon: 'icon-kaoqin--' },
    { key: 'logging', name: '日志', icon: 'icon-ribao' },
    { key: 'notice', name: '公告', icon: 'icon-gonggao' },
    { key: 'audit', name: '审批', icon: 'icon-shenpi-' },
    { key: 'netdisk', name: '网盘', icon: 'icon-wangpancopy' },
    { key: 'forms', name: '表单', icon: 'icon-biaodan' },
];
const ButtonText = item => (
    <Col span={8} key={item.key} className="e-mg-left-per">
        <Button className="e-mg-left-btn"><MyIcon icon={item.icon} size={32} iconColor={item.selected} /></Button>
        <p>{item.name}</p>
    </Col>
);

// 公司切换
const menu = (onclick, data) => (
    <Menu onClick={onclick}>
        {data.map(item => (<Menu.Item key={item.id}>{item.name}</Menu.Item>))}
    </Menu>
);
const Company = (onclick, data, companyname) => (
    <Col span={24} className="e-mg-left-company">
        <Dropdown overlay={menu(onclick, data)} trigger={['click']}>
            <a className="ant-dropdown-link" href="">
                {companyname || '暂无公司'}
                <Icon type="down" />
            </a>
        </Dropdown>
    </Col>
);

// 左侧卡片
class LeftCard extends (PureComponent || Component) {
    constructor(props) {
        super(props);
        this.state = {
            companys: [
                { id: '23', name: '中亿装饰中亿装饰' },
                { id: '22', name: '博彩装亿装饰' },
            ],
        };
    }
    componentWillMount() {
        const { companys } = this.props;
        this.setState({ companyname: companys[0] && companys[0].name });
    }
    // 切换公司
    clickCompany = ({ key }) => {
        let companyname;
        const { companys } = this.state;
        companys.forEach((item) => {
            if (item.id === key) {
                companyname = item.name;
            }
        });
        this.setState({ companyname }, () => {
            this.props.clickCompany(key);
        });
    }
    render() {
        const { location, companys } = this.props;
        const { companyname } = this.state;
        return (
            <Col span={6} className="e-mg-left">
                <Card bordered={false}>
                    {Company(this.clickCompany, companys || [], companyname)}
                    {btns.map(item => (ButtonText(item, location)))}
                </Card>
            </Col>
        );
    }
}

LeftCard.propTypes = {
    location: PropTypes.object,
    companys: PropTypes.array,
    clickCompany: PropTypes.func,
};

export default LeftCard;
