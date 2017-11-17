import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Input } from 'antd';
import ProjectTitle from './component/ProjectTitle';

const { TextArea } = Input;
@pureRender

class ProjectCopy extends Component {
    render() {
        return (
            <div>
                <ProjectTitle />
                <div>
                    <p>标题</p>
                    <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                    <p>列表</p>
                    <ul>
                        <li>任务板1</li>
                        <li>任务版2</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default ProjectCopy;
