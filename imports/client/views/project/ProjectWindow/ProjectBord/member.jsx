import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import AvatarSelf from '../../../../components/AvatarSelf';
import ProjectTitle from './component/ProjectTitle';

export default class Member extends Component {
    static propTypes = {
        click: PropTypes.func,
    }
    constructor(...props) {
        super(...props);
        this.state = {
            showFile: true,
        };
    }

   showFile=() => {
       this.setState({
           showFile: !this.state.showFile,
       });
   }
   showBack=() => {
       this.setState({
           showFile: !this.state.showFile,
       });
   }
   render() {
       return (
           <div className="member-display">
               <ul className="show-member" style={{ display: this.state.showFile ? 'block' : 'none' }}>
                   <li style={{ display: 'flex' }} className="touxiang"><AvatarSelf /><a>哈哈</a></li>
                   <li>从该卡片中移除</li>
                   <li onClick={this.showFile}>编辑资料</li>
               </ul>
               <div
                   className={`show-zhiliao ${this.state.showFile ? 'none' : 'show-zhiliao-chuxian'}`}
                   style={{ display: this.state.showFile ? 'none' : 'block' }}
               >
                   <ProjectTitle title="编辑资料" onClick={this.showBack} onCancel={this.props.click} />
                   <ul >
                       <li className="zhiliao-list">
                           <p>全称</p>
                           <Input style={{ height: '20px', width: '160px', background: ' #F4F4F4' }} />
                       </li>
                       <li>
                           <p>用户名</p>
                           <Input style={{ height: '20px', width: '160px', background: ' #F4F4F4' }} />
                       </li>
                       <li>
                           <p>缩写</p>
                           <Input style={{ height: '20px', width: '160px', background: ' #F4F4F4' }} />
                       </li>
                       <li>
                           <p>邮箱</p>
                           <Input style={{ height: '20px', width: '160px', background: ' #F4F4F4' }} />
                       </li>
                       <li>
                           <button>保存</button>
                       </li>
                   </ul>
               </div>
           </div>
       );
   }
}
