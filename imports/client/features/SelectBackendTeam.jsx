import React, { Component } from 'react';
import { Radio, Button, Modal } from 'antd';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import UserUtil from '../../util/user';
import Company from '../../schema/company';
import fields from '../../util/fields';
import CreateTeam from '../features/CreateTeam';
import feedback from '../../util/feedback';
import Avatar from '../components/Avatar';


const RadioGroup = Radio.Group;

@pureRender
class SelectBackendTeam extends Component {
    static propTypes = {
        createdCompany: PropTypes.array,
        selectBackendTeam: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            value: '',
            visible: false,
        };
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleCreateTeam = async (formValues) => {
        try {
            const result = await Meteor.callPromise('createCompany', formValues);
            feedback.dealSuccess('创建成功');
            this.handleCancel();
            this.setState({
                value: result,
            });
        } catch (err) {
            feedback.dealError(err);
        }
    }
    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className="select-one">
                {
                    this.props.createdCompany[0] ?
                        <div>
                            <RadioGroup onChange={this.onChange} value={this.state.value}>
                                {
                                    this.props.createdCompany.map(item =>
                                        (<Radio
                                            style={radioStyle}
                                            value={item._id}
                                            key={item._id}
                                        >
                                            <p className="user-info">
                                                <Avatar avatarColor="#29b6f6" name={item.name} avatar={item.logo} />
                                                {item.name}
                                            </p>
                                        </Radio>),
                                    )
                                }
                            </RadioGroup>
                            <br />
                            <div className="btn-wrap">
                                <Button type="primary" onClick={() => this.props.selectBackendTeam(this.state.value)}>确定</Button>
                            </div>
                        </div>
                        :
                        <div>你还没有创建团队,立即去
                            <button style={{ color: '#29b6f6' }} onClick={this.showModal} >创建</button>
                        </div>
                }
                <Modal
                    title="创建团队"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName="create-team-mask"
                    footer={null}
                    width={300}
                >
                    <CreateTeam
                        isShowAdd
                        handleSubmit={this.handleCreateTeam}
                    />
                </Modal>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    const companyIds = UserUtil.getCreatedCompany();
    const createdCompany = companyIds.map(_id =>
        Company.findOne({ _id }, { fields: fields.createdcompany }),
    );
    return {
        createdCompany,
    };
})(SelectBackendTeam);
