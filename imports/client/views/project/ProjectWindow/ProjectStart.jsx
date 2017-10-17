import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class ProjectStart extends Component {
      render(){
          return (
              <div className='ejianlian-project-start'> 
                       <p>开启您的团队协作之旅</p>
                       <p><img src='/start.jpg'/></p>
              </div>
          )
      }
}
