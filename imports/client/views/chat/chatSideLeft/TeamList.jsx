import React, { Component } from 'react';
import { Modal, Menu } from 'antd';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import CreateTeam from '../../../features/CreateTeam';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Company from '../../../../schema/company';
import feedback from '../../../../util/feedback';

const SubMenu = Menu.SubMenu;
class TeamList extends Component {
    static propTypes = {
        handleTeamMembers: PropTypes.func,
        companyList: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            currentTeamId: '',
        };
    }
    setCurrentTeamId = (currentTeamId) => {
        this.setState({
            currentTeamId,
        });
    }
    handleClick = (e) => {
        this.props.handleTeamMembers('teamMembers', this.state.currentTeamId, e.key, 'deps');
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
    handleCreateTeam = (formValues) => {
        Meteor.call('createCompany', formValues, (error, result) => {
            feedback.dealError(error);
            if (result) {
                feedback.dealSuccess('创建成功');
                this.handleCancel();
            }
        });
    }
    renderSubMenu = (departments) => {
        if (departments && departments.length) {
            return departments.map(dev =>
                <Menu.Item key={dev.id}>{dev.name}</Menu.Item>,
            );
        }
    }
    renderTeamTitle = (name, logo, membersLength) => <div className="team-title"><Avatar name="企业" avatarColor="red" avatar={logo} /><p>{name}({membersLength})</p></div>
    render() {
        console.log(this.props.companyList);
        return (
            <div className="team-list">
                <div className="create-team-btn">
                    <button onClick={this.showModal}>创建新团队</button>
                </div>
                <Modal
                    title="创建团队"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <CreateTeam
                        isShowAdd
                        handleSubmit={this.handleCreateTeam}
                    />
                </Modal>
                <div className="team-organization">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 240 }}
                        mode="inline"
                        className="team-menu"
                    >
                        {
                            this.props.companyList[0] && this.props.companyList.map(company =>
                                (<SubMenu
                                    onTitleClick={() => {
                                        this.props.handleTeamMembers('teamMembers', company._id);
                                        this.setCurrentTeamId(company._id);
                                    }
                                    }
                                    title={this.renderTeamTitle(company.name, company.logo, company.members.length)}
                                    key={company._id}
                                >
                                    {
                                        this.renderSubMenu(company.deps)
                                    }
                                </SubMenu>
                                ),
                            )
                        }
                    </Menu>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    const companyIds = UserUtil.getCompanyList();
    const companyList = companyIds.map(_id =>
        Company.findOne({ _id }),
    );
    return {
        companyList,
    };
})(TeamList);
