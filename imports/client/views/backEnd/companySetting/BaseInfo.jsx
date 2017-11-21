import React, { Component } from 'react';

import CreateTeam from '../../../features/CreateTeam';

class BaseInfo extends Component {
    render() {
        return (
            <div className="company-base-info-set company-set-arae">
                <div className="set-title">
                基本信息
                </div>
                <div className="set-area">
                    <CreateTeam />
                </div>

            </div>
        );
    }
}

export default BaseInfo;
