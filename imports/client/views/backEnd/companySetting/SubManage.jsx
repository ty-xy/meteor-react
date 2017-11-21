import React, { Component } from 'react';

import EditableTable from './EditableTable';


class SubManage extends Component {
    render() {
        return (
            <div className="company-sub-manage-set company-set-arae">
                <div className="set-title">
                子管理员
                </div>
                <EditableTable />
            </div>
        );
    }
}

export default SubManage;
