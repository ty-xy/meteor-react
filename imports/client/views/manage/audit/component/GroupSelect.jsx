import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Modal, Form, Col, Select, Row, Tag, Checkbox, Button } from 'antd';
import MyIcon from '../../../../components/Icon';
import Company from '../../../../../schema/company';

const Option = Select.Option;
const FormItem = Form.Item;


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
const colors = ['#7986CB', '#4DB6AC', '#9575CD', '#F06292'];

class GroupSelect extends (PureComponent || Component) {
    state = {
        visible: false,
        users: [],
        deps: [],
    }
    componentWillMount() {
        const { dep = [] } = this.props.companyInfo;
        let users = [];
        dep.forEach((item) => {
            users = users.concat(item.member);
        });
        this.setState({
            users: users || [],
            deps: dep,
        });
    }
    onSecondDepChange = (value) => {
        const { users } = this.state;
        let depnum = 0;
        let depnumd = 0;
        if (value === undefined) {
            users.forEach((item) => {
                depnum++;
                if (item.selected) {
                    depnumd++;
                }
            });
            this.setState({
                depVal: value,
                checked: depnumd === depnum,
            });
        } else {
            users.forEach((item) => {
                if (item.upLevel === value) {
                    depnum++;
                    if (item.selected) {
                        depnumd++;
                    }
                }
            });
            this.setState({
                depVal: value,
                checked: depnum === depnumd,
            });
        }
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
            if (item.userId === id) {
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
    // 选中群组
    handleGroupChange = (e, name) => {
        e.preventDefault();
        let allNum = 0;
        const { users, deps } = this.state;
        const _users = [];
        const _dep = [];
        users.forEach((item) => {
            if (item.upLevel === name) {
                item.selected = !item.selected;
            }
            if (item.selected) {
                allNum++;
            }
            _users.push(item);
        });
        deps.forEach((item) => {
            if (item.name === name) {
                item.selected = !item.selected;
            }
            _dep.push(item);
        });
        if (allNum < users.length) {
            this.setState({ users: _users, checked: false, allNum, deps: _dep });
        } else {
            this.setState({ users: _users, checked: true, allNum, deps: _dep });
        }
    }
    // 全选
    handleCheckbox = (e) => {
        let allNum = 0;
        const { users, checked, depVal, deps } = this.state;
        const _users = [];
        const _dep = deps;
        if (!depVal) {
            users.forEach((item) => {
                if (e.target.checked === true) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
                _users.push(item);
            });
            _dep.forEach((item) => {
                if (e.target.checked === true) {
                    allNum = 1;
                    item.selected = true;
                } else {
                    allNum = 0;
                    item.selected = false;
                }
            });
        } else {
            users.forEach((item) => {
                if (item.upLevel === depVal) {
                    if (e.target.checked === true) {
                        allNum++;
                        item.selected = true;
                    } else {
                        allNum--;
                        item.selected = false;
                    }
                }
                _users.push(item);
            });
        }
        this.setState({
            checked: !checked,
            users: _users,
            allNum,
            deps: _dep,
        });
    }
    // 选中的人
    getSelected = () => {
        const res = [];
        this.state.users.forEach((item) => {
            if (item.selected) {
                res.push(item.userId);
            }
        });
        this.setState({ visible: false });
        return res;
    }
    getAvatar = (avatar, name) => {
        if (avatar) {
            return (<img src={avatar} alt="" />);
        }
        return <span style={{ background: colors[Math.floor(Math.random() * 4)], color: '#FFF' }} className="e-mg-audit-deps-people-per-img e-mg-audit-deps-people-per-span">{name.slice(-2)}</span>;
    }
    render() {
        const { keyword, label, required, selectedValue = [], isSelectedFalseTitle, isSelectedTrueTitle, modelTitle, isSelectedFalseTitleDes, requiredErr, getGroup, isSelecteGroup } = this.props;
        const { name } = this.props.companyInfo;
        const { depVal, users, deps, checked, allNum } = this.state;
        // isSelecteGroup 是否为选择群组
        // 用户列表
        const searchUser = (data) => {
            if (depVal) {
                return data.map((item) => {
                    if (item.upLevel === depVal) {
                        return (
                            <a key={item.userId} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item.userId)}>
                                {this.getAvatar(item.avatar, item.name)}
                                {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                                <span>{item.name}</span>
                            </a>
                        );
                    }
                    return null;
                });
            }
            return data.map(item => (
                <a key={item.userId} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item.userId)}>
                    {this.getAvatar(item.avatar, item.name)}
                    {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                    <span>{item.name}</span>
                </a>
            ));
        };
        const searchDep = () => (
            deps.map(item => (
                <a key={item.name} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleGroupChange(e, item.name)}>
                    <span style={{ background: colors[Math.floor(Math.random() * 4)] }} className="e-mg-audit-deps-people-per-span">{item.name}</span>
                    {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                    <span>{item.name}</span>
                </a>
            ))
        );
        return (
            <div style={{ marginBottom: '20px' }}>
                <FormItem
                    {...formItemLayout}
                    label={label}
                    className="e-mg-audit-groupSelect"
                >

                    {
                        selectedValue.length ? <p style={{ color: 'rgb(180, 180, 180)' }}>{isSelectedTrueTitle}</p> : <a href="" className="e-mg-audit-leave-a" onClick={this.showModal}>{isSelectedFalseTitle} <span style={{ color: '#ccc' }}>{isSelectedFalseTitleDes}</span></a>
                    }

                </FormItem>
                <Col offset={6} style={{ position: 'relative' }}>
                    {
                        users.map((item) => {
                            if (item.selected) {
                                return (
                                    <a href="" key={item.userId} onClick={e => this.handleChange(e, item.userId)} className="e-mg-audit-seleted-img">
                                        {this.getAvatar(item.avatar, item.name)}
                                        <p>{item.name}</p>
                                    </a>
                                );
                            }
                            return null;
                        })
                    }
                    <span className="e-mg-audit-seleted-img">
                        <MyIcon icon="icon-tianjia3" size={36} onClick={this.showModal} />
                        <p style={{ marginTop: '-6px' }}>{label}</p>
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
                    width="700px"
                    maskClosable={false}
                >
                    <Row className="e-mg-audit-xuanze-row">
                        <div className="e-mg-audit-xuanze-left e-mg-audit-xuanze-col">
                            {
                                users.map(item => (item.selected ? <Tag key={item.userId} closable className="margin-bottom-20" onClose={() => this.handleChange(item.userId)}>{item.name}</Tag> : null))
                            }
                        </div>
                        <div className="e-mg-audit-xuanze-right e-mg-audit-xuanze-col">
                            <div className="margin-left-20" style={{ color: '#15b4f1', fontSize: '14px', marginBottom: '10px' }}>{name}</div>
                            {
                                isSelecteGroup ? null : (
                                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                        <span className="margin-left-20">部门：</span>
                                        <Select allowClear style={{ width: '80%', marginLeft: '5px' }} placeholder="选择部门搜索" onChange={this.onSecondDepChange}>
                                            {
                                                deps.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
                                            }
                                        </Select>
                                    </div>
                                )
                            }
                            <div className="e-mg-audit-deps-people margin-top-20">
                                <Checkbox checked={checked} onChange={e => this.handleCheckbox(e, isSelecteGroup)} style={{ marginLeft: '10px', marginBottom: '10px' }}>全选</Checkbox>
                                {
                                    isSelecteGroup ? searchDep(depVal) : searchUser(users)
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
    selectedValue: PropTypes.array,
    isSelectedFalseTitleDes: PropTypes.string,
    modelTitle: PropTypes.string,
    isSelecteGroup: PropTypes.bool,
};
export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find().fetch();
    const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    let companyInfo = {};
    companys.forEach((item) => {
        if (item._id === mainCompany) {
            companyInfo = item;
        }
    });
    return {
        companyInfo,
        companys,
    };
})(GroupSelect);

