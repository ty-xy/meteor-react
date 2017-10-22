
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import pureRender from 'pure-render-decorator';
// import MyIcon from '../../../components/Icon';

@pureRender
class ProjectBordItem extends Component {
    render() {
        return (
            <div className="ejianlian-project-item">
                <div className="project-input">
                    <Input style={{ width: 200, height: 40 }} placeholder="任务版名称" />
                </div>
                <div className="project-button">
                    <button>取消</button>
                    <Button type="primary">确认</Button>
                </div>
            </div>
        );
    }
}

export default ProjectBordItem;
