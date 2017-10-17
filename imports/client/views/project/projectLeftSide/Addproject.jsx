import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import Dialog  from './Dailog'
 export default  class AddProject extends Component{
       render(){
           return (
               <div className='ejianlian-add-project'>
                   <div className='add-button'>
                   <input type="button" onClick={this.props.onClick} value="创建项目"/>
                   </div>
               </div>
           )
       }
 }
