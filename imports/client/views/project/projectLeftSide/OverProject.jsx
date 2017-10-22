import React, { Component } from 'react';
import { Modal } from 'antd';
import pureRender from 'pure-render-decorator';
import Icon from '../../../components/Icon';
import ProjectAdd from './ProjectAdd';

// import PropTypes from 'prop-types';

@pureRender
export default class OverProject extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            visible: false,
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        console.log(1);
    }
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div>
                <Modal
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.hideModal}
                    onOk={this.hideModal}
                    width={450}
                >
                    <ProjectAdd click={this.hideModal} />
                </Modal>
                <div className="ejianlian-add-project">
                    <div className="user-avatar project-notice project-icon-plus">
                        <Icon icon="icon-jiahao icon" onClick={this.showModal} />
                    </div>
                    <p className="over-project">创建项目</p>
                </div>
                <div className="ejianlian-add-project  project-over">
                    <div className="project-notice user-avatar">
                        <Icon icon="icon-guidangxiangmu  icon" />
                    </div>
                    <p className="over-project">已归档的项目</p>
                </div>
            </div>
        );
    }
}
