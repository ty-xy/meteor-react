import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import CreateTeam from '../../../features/CreateTeam';
import feedback from '../../../../util/feedback';
import UserUtil from '../../../../util/user';

@pureRender
class BaseInfo extends Component {
    static propTypes = {
        currentCompanyId: PropTypes.string,
    }
    handleUpdateTeam = (formValues) => {
        Meteor.call('changeCompanyInfo', formValues, (error, result) => {
            feedback.dealError(error);
            if (result) {
                feedback.dealSuccess('修改成功');
            }
        });
    }
    render() {
        return (
            <div className="company-base-info-set company-set-arae">
                <div className="set-title">
                基本信息
                </div>
                <div className="set-area">
                    <CreateTeam
                        handleSubmit={this.handleUpdateTeam}
                        currentCompanyId={this.props.currentCompanyId}
                    />
                </div>

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    const currentCompanyId = UserUtil.getCurrentBackendCompany();
    return {
        currentCompanyId,
    };
})(BaseInfo);
