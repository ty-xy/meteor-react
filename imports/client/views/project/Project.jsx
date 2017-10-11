import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
class Project extends Component {
    render() {
        return (
            <div>
                这是项目
            </div>
        );
    }
}

export default Project;
