import React, { Component } from 'react';
import { Modal } from 'antd';
import CreateTeam from '../../../features/CreateTeam';

class TeamList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
        };
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
                    <CreateTeam isShowAdd="true" />
                </Modal>
            </div>
        );
    }
}

export default TeamList;
