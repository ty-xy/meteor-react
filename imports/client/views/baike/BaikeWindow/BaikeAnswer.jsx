import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Input, Tabs } from 'antd';
// import reqwest from 'reqwest';
// import InfiniteScroll from 'react-infinite-scroller';

import Icon from '../../../components/Icon';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
// const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@pureRender
class BaikeFirst extends Component {
    state = {
    }

     callback=(key) => {
         console.log(key);
     }
     render() {
         return (
             <div className="ejianlian-baike-window">
                 <div className="ejianlian-people-window">
                     <div className="ejian-people-window-title">
                         <div className="ejian-people-window-title-left">
                             <Icon
                                 icon="icon-bangzhu"
                                 iconColor="#29B6F6"
                                 size={40}
                             />
                             <p>知工问答</p>
                         </div>
                         <Search
                             placeholder="请输入关键词..."
                             size="large"
                             onSearch={value => console.log(value)}
                             style={{ width: 300, height: 50 }}
                             className="baike-search"
                         />
                     </div>
                     <div className="ejian-answer-window" >
                         <Tabs defaultActiveKey="1" onChange={this.callback} className="answer-tab">
                             <TabPane tab="最新" key="1" >
                                 ewqe
                             </TabPane>
                             <TabPane tab="热门" key="2">Content of Tab Pane 2</TabPane>
                             <TabPane tab="问答专厂" key="3">Content of Tab Pane 3</TabPane>
                         </Tabs>
                     </div>
                 </div>
             </div>
         );
     }
}

export default BaikeFirst;
