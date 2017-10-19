import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import AddProject from './Addproject';
import Dialog from './ProjectAdd';

@pureRender
export default class ProjectList extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {
            model: false,
            message: [
                { name: '公元九里写字楼项目', time: '2017-05-30', num: 29 },
                { name: '公元九里写字楼项目', time: '2017-02-23', num: 45 },
            ],
        };
    }
    handleClick = () => {
        this.setState({ model: !this.state.model });
    }
    render() {
        return (
            <div className="ejianlian-project-list">
                <Dialog style={{ display: this.state.model ? 'none' : 'block' }} click={this.handleClick} />
                <ul >
                    <li className="list-item">
                        <div className="list-img">
                            <img src="http://img.duoziwang.com/2016/10/02/15235311191.jpg" alt="" />
                        </div>
                        <div className="list-right">
                            <p>{this.state.message[0].name}</p>
                            <p>周晓梅创建于：{this.state.message[0].time}</p>
                            <p>项目成员：{this.state.message[0].num}</p>
                        </div>
                    </li>
                    <li className="list-item">
                        <div className="list-img">
                            <img src="http://img.duoziwang.com/2016/10/02/15235311191.jpg" alt="" />
                        </div>
                        <div className="list-right">
                            <p>{this.state.message[1].name}</p>
                            <p>周晓梅创建于：{this.state.message[1].time}</p>
                            <p>项目成员：{this.state.message[1].num}</p>
                        </div>
                    </li>
                </ul>
                <AddProject onClick={this.handleClick} value="项目" />
            </div>
        );
    }
}
