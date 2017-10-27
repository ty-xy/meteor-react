import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import ProjectBordAdd from './ProjectBordAdd';

@pureRender
export default class projectTask extends Component {
    render() {
        return (
            <div>
                <ProjectBordAdd />
            </div>
        );
    }
}
