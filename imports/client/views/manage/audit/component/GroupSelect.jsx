import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Modal, Form, Col, Select, Row, Tag, Checkbox, Button } from 'antd';
import MyIcon from '../../../../components/Icon';

const Option = Select.Option;
const FormItem = Form.Item;
const companyData = [
    { name: '中亿集团', _id: 'sdhj3jhskd_', deps: [{ name: '商务部', _id: 'hd32hjd43j_' }, { name: '技术部', _id: 'hd32hjsd43j_' }] },
    { name: '摩尔集团', _id: 'sdhj3jhdhskd_', deps: [{ name: '行政部', _id: 'ahd32hjd43j_' }, { name: '产品部', _id: 'hd32s2hjsd43j_' }] },
];


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class GroupSelect extends (PureComponent || Component) {
    state = {
        visible: false,
        deps: companyData[0].deps,
        secondDep: companyData[0].deps[0].name,
        users: [
            { _id: 'sdjk2305_dj', username: '1382490', profile: { name: '小米', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk230ds5_dj', username: '1382490', profile: { name: '小绿', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk2sd305_dgs', username: '1382e490', profile: { name: '小灰', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk230bmnb5_dj', username: '13824fs90', profile: { name: '小黑1', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk23035_dj', username: '1382490', profile: { name: '小米2', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk2301ds5_dj', username: '1382490', profile: { name: '小绿3', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk24sd305_dgs', username: '1382e490', profile: { name: '小灰4', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk2230bmnb5_dj', username: '13824fs90', profile: { name: '小黑5', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk23055_dj', username: '1382490', profile: { name: '小米6', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk2306ds5_dj', username: '1382490', profile: { name: '小绿7', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk2sd3805_dgs', username: '1382e490', profile: { name: '小灰8', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
            { _id: 'sdjk230bmnb95_dj', username: '13824fs90', profile: { name: '小黑9', avatar: '//oxldjnom8.bkt.clouddn.com/avatar_bEuDeBDKumrTka7t9_1509151555626.jpeg' } },
        ],
    }
    handleCompanyChange = (value) => {
        let secondDep = '';
        let deps = [];
        companyData.forEach((item) => {
            if (value === item._id) {
                secondDep = item.deps[0].name;
                deps = item.deps;
            }
            return [];
        });
        this.setState({
            deps,
            secondDep,
        });
    }
    onSecondDepChange = (value) => {
        this.setState({
            secondDep: value,
        });
    }
    showModal = (e) => {
        e.preventDefault();
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        const users = this.state.users.map((item) => {
            item.selected = false;
            return item;
        });
        this.setState({
            visible: false,
            users,
        });
    }
    // 选中人
    handleChange = (e, id) => {
        if (typeof e === 'object') {
            e.preventDefault();
        } else {
            id = e;
        }
        const users = [];
        let allNum = 0;
        this.state.users.forEach((item) => {
            if (item._id === id) {
                item.selected = !item.selected;
            }
            if (item.selected) {
                allNum++;
            }
            users.push(item);
        });
        if (allNum < this.state.users.length) {
            this.setState({ users, checked: false, allNum });
        } else {
            this.setState({ users, checked: true, allNum });
        }
    }
    // 全选
    handleCheckbox = (e) => {
        let allNum = 0;
        const { users, checked } = this.state;
        const _users = users.map((item) => {
            if (e.target.checked === true) {
                allNum = 1;
                item.selected = true;
            } else {
                allNum = 0;
                item.selected = false;
            }
            return item;
        });
        this.setState({
            checked: !checked,
            users: _users,
            allNum,
        });
    }
    // 选中的人
    getSelected = () => {
        const res = [];
        this.state.users.forEach((item) => {
            if (item.selected) {
                res.push(item._id);
            }
        });
        this.setState({ visible: false });
        return res;
    }
    // 公司
    companyOptions = () => (
        companyData.map(company => <Option key={company._id} value={company._id}>{company.name}</Option>)
    )
    render() {
        const { keyword, label, required, isSelected, isSelectedFalseTitle, isSelectedTrueTitle, modelTitle, selectValue = [], isSelectedFalseTitleDes, requiredErr, getGroup } = this.props;
        console.log('默认的时间', selectValue);
        const { deps, users, checked, allNum } = this.state;
        return (
            <div style={{ marginBottom: '20px' }}>
                <FormItem
                    {...formItemLayout}
                    label={label}
                    className="e-mg-audit-groupSelect"
                >

                    {
                        isSelected ? <p style={{ color: 'rgb(180, 180, 180)' }}>{isSelectedTrueTitle}</p> : <a href="" className="e-mg-audit-leave-a" onClick={this.showModal}>{isSelectedFalseTitle} <span style={{ color: '#ccc' }}>{isSelectedFalseTitleDes}</span></a>
                    }

                </FormItem>
                <Col offset={6} style={{ position: 'relative' }}>
                    {
                        users.map((item) => {
                            if (item.selected) {
                                return (
                                    <a href="" key={item._id} onClick={e => this.handleChange(e, item._id)} className="e-mg-audit-seleted-img">
                                        <img src={item.profile.avatar} alt="" />
                                        <p>{item.profile.name}</p>
                                    </a>
                                );
                            }
                            return null;
                        })
                    }
                    <span className="e-mg-audit-seleted-img">
                        <MyIcon icon="icon-tianjia3" size={36} onClick={this.showModal} />
                        <p style={{ marginTop: '-6px' }}>审批人</p>
                        {required ? <span style={{ position: 'absolute',
                            top: '20px',
                            left: '60px',
                            color: '#EF5350',
                        }}
                        ><MyIcon icon="icon-cuowu" /> {requiredErr}!</span> : null}
                    </span>
                </Col>
                <Modal
                    title={(<p className="text-center">{modelTitle}</p>)}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="e-mg-audit-xuanze"
                    width="600px"
                    maskClosable={false}
                >
                    <Row className="e-mg-audit-xuanze-row">
                        <div className="e-mg-audit-xuanze-left e-mg-audit-xuanze-col">
                            {
                                users.map(item => (item.selected ? <Tag key={item._id} closable className="margin-bottom-20" onClose={() => this.handleChange(item._id)}>{item.profile.name}</Tag> : null))
                            }
                        </div>
                        <div className="e-mg-audit-xuanze-right e-mg-audit-xuanze-col">
                            <span>公司：</span>
                            <Select defaultValue={companyData[0]._id} style={{ width: 110 }} onChange={this.handleCompanyChange}>
                                {this.companyOptions()}
                            </Select>
                            <Select allowClear value={this.state.secondDep} style={{ width: 80, marginLeft: '5px' }} onChange={this.onSecondDepChange}>
                                {
                                    deps.map(dep => <Option key={dep._id} value={dep._id}>{dep.name}</Option>)
                                }
                            </Select>
                            <div className="e-mg-audit-deps-people margin-top-20">
                                <Checkbox checked={checked} onChange={this.handleCheckbox} style={{ marginLeft: '10px', marginBottom: '10px' }}>全选</Checkbox>
                                {
                                    users.map(item => (
                                        <a key={item._id} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item._id)}>
                                            <img src={item.profile.avatar} alt="" />
                                            {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                                            <span>{item.profile.name}</span>
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                    </Row>
                    <Row className="text-center margin-top-20 e-mg-audit-xuanze-footer" style={{ margin: '20px -15px -15px' }}>
                        <Button type="primary" disabled={!allNum} onClick={() => getGroup(keyword, this.getSelected())}>提交</Button>
                    </Row>
                </Modal>
            </div>
        );
    }
}
GroupSelect.propTypes = {
    form: PropTypes.object,
    keyword: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    selectValue: PropTypes.string,
    width: PropTypes.string,
    isSelected: PropTypes.bool,
    isSelectedFalseTitleDes: PropTypes.string,
    modelTitle: PropTypes.string,
};
export default withTracker(() => {
    Meteor.subscribe('user');
    return {
        allUsers: Meteor.users.find().fetch(),
    };
})(GroupSelect);

