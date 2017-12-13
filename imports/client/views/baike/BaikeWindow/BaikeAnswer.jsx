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
    // state = {
    // }

    //  callback=(key) => {
    //      console.log(key);
    //  }
    render() {
        return (
            <div className="ejianlian-baike-window">
                <div className="ejianlian-people-window">
                    <div className="ejian-people-window-title ejian-wenda-window-title">
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
                            <TabPane tab="最新" key="1" className="answer-tab-list" >
                                <ul>
                                    <li className="wenda-list-detaild">
                                        <h4>图纸签名：设计、审核、校对谁的责任大？</h4>
                                        <p>
                                        字是不能随便签的，出了事故，一般是设计人负60%--65%的责任，
                                        专业负责负20%--30%的责任，校对是10%，审核是5%，审定3%。
                                        但是具体问题要具体对待，事故具体责任划分还是得依据事故的责任界定来处理。
                                        所以说，一般不要随便签字，一定要仔细看图，没问题…<a>显示全部</a>
                                        </p>
                                    </li>
                                    <li className="wenda-list-detaild">
                                        <h4>施工组织设计如何做好，做完整？</h4>
                                        <p>
                                        很多专业都有相应的施工组织设计规范，按照相应的规范要求编制，
                                        你的施工组织设计就很完整且很专业。至于专业水平高低取决于你的工作经验、专业造诣啦。
                                        国家有规范要求，各个公司也应该有自己的程序支撑，按照规范和程序去编制，
                                        应该就不会有什么大问题<a>显示全部</a>
                                        </p>
                                    </li>
                                    <li className="wenda-list-detaild">
                                        <h4>毕业一年多，换工作的话是去建筑设计院好，还是去房地产好？</h4>
                                        <p>
                                        建筑设计院更稳定，但工资不高，私活不少，是挣外快的来源。
                                        房地产工作不太稳定，但工资较高，实践机会较多。
                                        建议先设计院，根据情况再寻找房地产公司<a>显示全部</a>
                                        </p>
                                    </li>
                                    <li className="wenda-list-detaild">
                                        <h4>为什么中国的现代建筑感觉都是一个模式，很少有特别好看的？</h4>
                                        <p>
                                        设计是缺少独具匠心。而放眼国内，各大设计单位，
                                        不都是抢着画施工图吗？很多搞设计的也就只是简单的抄袭模仿，
                                        而中国想来都觉得国外的好，总是让外国人来设计自己国家的东西，
                                        他们的设计出来的东西当然也很有感觉，那些国外大师的先进设计理念无不展现给了我们，
                                        但是却少了许多中国本土地域特色，因为他们自己没有生活在这块土<a>显示全部</a>
                                        </p>
                                    </li>
                                    <li className="wenda-list-detaild">
                                        <h4>为什么中国的现代建筑感觉都是一个模式，很少有特别好看的？</h4>
                                        <p>
                                        设计是缺少独具匠心。而放眼国内，各大设计单位，
                                        不都是抢着画施工图吗？很多搞设计的也就只是简单的抄袭模仿，
                                        而中国想来都觉得国外的好，总是让外国人来设计自己国家的东西，
                                        他们的设计出来的东西当然也很有感觉，那些国外大师的先进设计理念无不展现给了我们，
                                        但是却少了许多中国本土地域特色，因为他们自己没有生活在这块土<a>显示全部</a>
                                        </p>
                                    </li>
                                </ul>
                            </TabPane>
                            <TabPane tab="热门" key="2">Content of Tab Pane 2</TabPane>
                            <TabPane tab="问答专场" key="3">Content of Tab Pane 3</TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default BaikeFirst;
