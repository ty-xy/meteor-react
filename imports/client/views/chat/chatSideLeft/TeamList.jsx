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
import Icon from '../../../components/Icon';

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
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleCreateTeam = async (formValues) => {
        try {
            await Meteor.callPromise('createCompany', formValues);
            feedback.dealSuccess('创建成功');
            this.handleCancel();
        } catch (err) {
            feedback.dealError(err);
        }
    }
    renderSubMenu = (departments) => {
        if (departments && departments.length) {
            return departments.map(dev =>
                <Menu.Item key={dev.id}><Icon icon="icon-Path" size={15} iconColor="#979797" />&nbsp;{dev.name}</Menu.Item>,
            );
        }
    }
    renderTeamTitle = (name, logo, membersLength) => <div className="team-title"><Avatar name="企业" avatarColor="red" avatar={logo} /><p>{name}({membersLength})</p></div>
    render() {
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
                                (company ?
                                    <SubMenu
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
                                    :
                                    null),

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
