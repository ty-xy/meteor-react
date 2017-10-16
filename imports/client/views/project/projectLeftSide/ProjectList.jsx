import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
@pureRender
export default class ProjectList extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            message: [
                { name: '公元九里写字楼项目', time: '2017-05-30', num: 29 },
                { name: '公元九里写字楼项目', time: '2017-02-23', num: 45 },
            ],
        };
    }
    render() {
        return (
            <div className="ejianlian-project-list">
                <ul >
                    <li>
                        <p>{this.state.name}</p>
                        <p>{this.state.time}</p>
                        <p>{this.state.num}</p>
                    </li>
                </ul>
            </div>
        );
    }
}
